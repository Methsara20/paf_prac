package com.paf.chat.controllers;

import com.paf.chat.entities.Message;
import com.paf.chat.entities.Room;
import com.paf.chat.playload.MessageRequest;
import com.paf.chat.repositories.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // For sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")
    public void handleMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {
        logger.info("Received message for room {}: {}", roomId, request.getContent());
        
        Message resultMessage;
        
        try {
            // Handle message update
            if (request.isUpdate()) {
                resultMessage = updateMessage(roomId, request);
            }
            // Handle message deletion
            else if (request.isDelete()) {
                resultMessage = deleteMessage(roomId, request);
            }
            // Handle new message
            else {
                resultMessage = createNewMessage(roomId, request);
            }
            
            // Explicitly broadcast the message to all clients
            String destination = "/topic/room/" + roomId;
            logger.info("Broadcasting message to destination: {}", destination);
            messagingTemplate.convertAndSend(destination, resultMessage);
        } catch (Exception e) {
            logger.error("Error handling message: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private Message createNewMessage(String roomId, MessageRequest request) {
        Room room = roomRepository.findByRoomId(request.getRoomId());
        if (room == null) {
            logger.error("Room not found: {}", request.getRoomId());
            throw new RuntimeException("Room not found");
        }

        Message message = new Message();
        message.setId(UUID.randomUUID().toString());
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());
        message.setEdited(false);
        message.setDeleted(false);
        
        // Handle file attachment if present
        if (request.getFileUrl() != null && !request.getFileUrl().isEmpty()) {
            logger.info("Message contains file: {}, type: {}", request.getFileName(), request.getFileType());
            message.setFileUrl(request.getFileUrl());
            message.setFileType(request.getFileType());
            message.setFileName(request.getFileName());
        }

        room.getMessages().add(message);
        roomRepository.save(room);
        logger.info("Message saved and sent to subscribers");

        return message;
    }
    
    private Message updateMessage(String roomId, MessageRequest request) {
        logger.info("Updating message with ID: {} in room: {}", request.getId(), roomId);
        
        Room room = roomRepository.findByRoomId(request.getRoomId());
        if (room == null) {
            logger.error("Room not found: {}", request.getRoomId());
            throw new RuntimeException("Room not found");
        }
        
        // Find the message to update
        Message messageToUpdate = null;
        for (Message message : room.getMessages()) {
            if (message.getId() != null && message.getId().equals(request.getId())) {
                messageToUpdate = message;
                break;
            }
        }
        
        if (messageToUpdate == null) {
            logger.error("Message not found with ID: {}", request.getId());
            throw new RuntimeException("Message not found");
        }
        
        // Verify that the sender is updating their own message
        if (!messageToUpdate.getSender().equals(request.getSender())) {
            logger.error("User {} attempted to edit a message from {}", 
                request.getSender(), messageToUpdate.getSender());
            throw new RuntimeException("You can only edit your own messages");
        }
        
        // Update the message content
        messageToUpdate.setContent(request.getContent());
        messageToUpdate.setEdited(true);
        
        roomRepository.save(room);
        logger.info("Message updated successfully");
        
        return messageToUpdate;
    }
    
    private Message deleteMessage(String roomId, MessageRequest request) {
        logger.info("Deleting message with ID: {}, in room: {}", request.getId(), roomId);
        
        Room room = roomRepository.findByRoomId(request.getRoomId());
        if (room == null) {
            logger.error("Room not found: {}", request.getRoomId());
            throw new RuntimeException("Room not found");
        }
        
        // Find the message to delete
        Message messageToDelete = null;
        for (Message message : room.getMessages()) {
            if (message.getId() != null && message.getId().equals(request.getId())) {
                messageToDelete = message;
                break;
            }
        }
        
        if (messageToDelete == null) {
            logger.error("Message not found with ID: {}", request.getId());
            throw new RuntimeException("Message not found");
        }
        
        // Verify that the sender is deleting their own message
        if (!messageToDelete.getSender().equals(request.getSender())) {
            logger.error("User {} attempted to delete a message from {}", 
                request.getSender(), messageToDelete.getSender());
            throw new RuntimeException("You can only delete your own messages");
        }
        
        // Mark the message as deleted
        messageToDelete.setDeleted(true);
        messageToDelete.setContent("This message was deleted");
        
        // Save the room with the deleted message
        room = roomRepository.save(room);
        logger.info("Message deleted successfully, content: {}, deleted: {}", 
                messageToDelete.getContent(), messageToDelete.isDeleted());
        
        // Create a fresh copy of the message for broadcasting
        Message deletedMessage = new Message();
        deletedMessage.setId(messageToDelete.getId());
        deletedMessage.setSender(messageToDelete.getSender());
        deletedMessage.setContent("This message was deleted");
        deletedMessage.setTimeStamp(messageToDelete.getTimeStamp());
        deletedMessage.setDeleted(true);
        deletedMessage.setEdited(messageToDelete.isEdited());
        deletedMessage.setFileUrl(messageToDelete.getFileUrl());
        deletedMessage.setFileType(messageToDelete.getFileType());
        deletedMessage.setFileName(messageToDelete.getFileName());
        
        // Log the message being returned
        logger.info("Returning deleted message: {}, deleted status: {}", 
                deletedMessage.getContent(), deletedMessage.isDeleted());
        
        return deletedMessage;
    }
}
