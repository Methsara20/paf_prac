package com.paf.chat.controllers;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.paf.chat.config.JwtUtil;
import com.paf.chat.entities.Role;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.UserRepository;
import com.paf.chat.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping(value = "/signup-with-image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> signupWithImage(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(new BCryptPasswordEncoder().encode(password));
        user.setRoles(Collections.singleton(Role.USER));

        if (file != null && !file.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destFile = new File(uploadDir + File.separator + filename);
            file.transferTo(destFile);
            user.setProfileImage("/uploads/" + filename);
        }

        userRepository.save(user);
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signin(@RequestBody Map<String, String> request) {
        String token = userService.authenticateUser(request.get("email"), request.get("password"));
        if (token.equals("Invalid credentials")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", token));
        }
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PutMapping(value = "/update-profile", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam(required = false) String password,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) throws IOException {

        String token = request.getHeader("Authorization").substring(7);
        String userEmail = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        if (file != null && !file.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destFile = new File(uploadDir + File.separator + filename);
            file.transferTo(destFile);
            user.setProfileImage("/uploads/" + filename);
        }

        if (!user.getEmail().equals(email) && userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        user.setUsername(username);
        user.setEmail(email);
        if (password != null && !password.isBlank()) {
            user.setPassword(new BCryptPasswordEncoder().encode(password));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(HttpServletRequest request) {
        String email = jwtUtil.extractEmail(request.getHeader("Authorization").substring(7));
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
