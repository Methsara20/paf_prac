package com.paf.chat.controllers;

import com.paf.chat.entities.Message;
import com.paf.chat.entities.Room;
import com.paf.chat.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {  // Changed method name to lowercase
        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // Get room: Join
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);  // Fixed variable name
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok(room);  // Return the found room
    }

    // Get messages of room
    @GetMapping("/{roomId}/messages")  // Fixed URL path syntax
    public ResponseEntity<?> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        List<Message> messages = room.getMessages();
        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.ok(List.of());  // Return empty list if no messages
        }

        // Handle pagination
        int start = Math.max(0, page * size);  // Fixed pagination calculation
        int end = Math.min(messages.size(), start + size);

        if (start >= messages.size()) {
            return ResponseEntity.ok(List.of());  // Return empty if page is out of bounds
        }

        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);  // Return paginated results
    }
}