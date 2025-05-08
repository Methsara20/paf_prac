package com.paf.chat.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private String title;
    private String description;
    private List<String> mediaPaths;
    private LocalDateTime createdAt;
    private String userId;
    private Set<String> likedBy = new HashSet<>();

    public Post() {
    }

    public Post(String id, String title, String description, List<String> mediaPaths, LocalDateTime createdAt, String userId, Set<String> likedBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mediaPaths = mediaPaths;
        this.createdAt = createdAt;
        this.userId = userId;
        this.likedBy = likedBy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaPaths() {
        return mediaPaths;
    }

    public void setMediaPaths(List<String> mediaPaths) {
        this.mediaPaths = mediaPaths;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Set<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }
}
