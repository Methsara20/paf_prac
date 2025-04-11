package com.paf.chat.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
@CrossOrigin("http://localhost:5173")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Received file upload request: {}", file.getOriginalFilename());
        try {
            // Create uploads directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("Created upload directory: {}", uploadDir);
            }

            // Generate a unique file name to prevent collisions
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            
            // Save the file
            Path filePath = Paths.get(uploadDir, uniqueFileName);
            Files.write(filePath, file.getBytes());
            logger.info("File saved at: {}", filePath);
            
            // Determine file type (image, video, document)
            String fileType = determineFileType(file.getContentType());
            
            // Create response with file info
            Map<String, String> response = new HashMap<>();
            response.put("fileName", originalFileName);
            response.put("fileUrl", "/api/v1/files/view/" + uniqueFileName);
            response.put("fileType", fileType);
            
            logger.info("File upload successful. Type: {}, URL: {}", fileType, response.get("fileUrl"));
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error uploading file: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) {
        logger.info("File download request for: {}", fileName);
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            byte[] fileContent = Files.readAllBytes(filePath);
            
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            logger.info("Serving file: {}, Content-Type: {}, Size: {} bytes", fileName, contentType, fileContent.length);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (IOException e) {
            logger.error("Error serving file {}: {}", fileName, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }
    
    private String determineFileType(String contentType) {
        if (contentType == null) {
            return "document";
        }
        
        if (contentType.startsWith("image/")) {
            return "image";
        } else if (contentType.startsWith("video/")) {
            return "video";
        } else if (contentType.startsWith("audio/")) {
            return "audio";
        } else {
            return "document";
        }
    }
} 