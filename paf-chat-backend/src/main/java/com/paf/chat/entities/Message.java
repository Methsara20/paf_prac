package com.paf.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Message {
    private String id;
    private String sender;
    private String content;
    private LocalDateTime timeStamp;
    private String fileUrl;
    private String fileType; // image, video, document, etc.
    private String fileName;
    private boolean edited;
    private boolean deleted;

    public Message(String sender, String content) {
        this.id = UUID.randomUUID().toString();
        this.sender = sender;
        this.content = content;
        this.timeStamp = LocalDateTime.now();
        this.edited = false;
        this.deleted = false;
    }
}
