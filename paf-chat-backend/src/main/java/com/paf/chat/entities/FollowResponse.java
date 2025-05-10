package com.paf.chat.entities;

public class FollowResponse {

    private String id;
    private User follower;

    public FollowResponse(String id, User follower) {
        this.id = id;
        this.follower = follower;
    }

    public String getId() {
        return id;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public void setId(String id) {
        this.id = id;
    }
}
