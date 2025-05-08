package com.paf.chat.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "follows")
public class Follow {

    @Id
    private String id;
    private String followerId;
    private String followingId;
    private FollowStatus status;

    public Follow() {
    }

    public Follow(String id, String followerId, String followingId, FollowStatus status) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getFollowingId() {
        return followingId;
    }

    public void setFollowingId(String followingId) {
        this.followingId = followingId;
    }

    public FollowStatus getStatus() {
        return status;
    }

    public void setStatus(FollowStatus status) {
        this.status = status;
    }
}
