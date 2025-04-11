package com.paf.chat.controllers;

import com.paf.chat.entities.Message;
import com.paf.chat.entities.Room;
import com.paf.chat.repositories.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private static final Logger logger = LoggerFactory.getLogger(RoomController.class);
    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        logger.info("Creating room with ID: {}", roomId);
        try {
            if (roomId == null || roomId.trim().isEmpty()) {
                logger.warn("Attempted to create room with null or empty ID");
                return ResponseEntity.badRequest().body("Room ID cannot be empty");
            }
            
            Room existingRoom = roomRepository.findByRoomId(roomId);
            if (existingRoom != null) {
                logger.warn("Room with ID {} already exists", roomId);
                return ResponseEntity.badRequest().body("Room already exists");
            }

            Room room = new Room();
            room.setRoomId(roomId);
            Room savedRoom = roomRepository.save(room);
            logger.info("Room created successfully with ID: {}", roomId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
        } catch (Exception e) {
            logger.error("Error creating room with ID {}: {}", roomId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating room: " + e.getMessage());
        }
    }

    // Get room: Join
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        logger.info("Joining room with ID: {}", roomId);
        try {
            Room room = roomRepository.findByRoomId(roomId);
            if (room == null) {
                logger.warn("Attempted to join non-existent room with ID: {}", roomId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
            }
            logger.info("Successfully joined room with ID: {}", roomId);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            logger.error("Error joining room with ID {}: {}", roomId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error joining room: " + e.getMessage());
        }
    }

    // Get messages of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        logger.info("Getting messages for room ID: {}, page: {}, size: {}", roomId, page, size);
        try {
            Room room = roomRepository.findByRoomId(roomId);
            if (room == null) {
                logger.warn("Attempted to get messages from non-existent room with ID: {}", roomId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
            }

            List<Message> messages = room.getMessages();
            if (messages == null || messages.isEmpty()) {
                logger.info("No messages found for room ID: {}", roomId);
                return ResponseEntity.ok(List.of());
            }

            // Handle pagination
            int start = Math.max(0, page * size);
            int end = Math.min(messages.size(), start + size);

            if (start >= messages.size()) {
                logger.info("Pagination start index {} exceeds message count {} for room ID: {}", 
                    start, messages.size(), roomId);
                return ResponseEntity.ok(List.of());
            }

            List<Message> paginatedMessages = messages.subList(start, end);
            logger.info("Retrieved {} messages for room ID: {}", paginatedMessages.size(), roomId);
            return ResponseEntity.ok(paginatedMessages);
        } catch (Exception e) {
            logger.error("Error getting messages for room ID {}: {}", roomId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting messages: " + e.getMessage());
        }
    }
}