package com.paf.chat.entities;

public class CommentResponse {

    private Comment comment;
    private User user;

    public CommentResponse(Comment comment, User user) {
        this.comment = comment;
        this.user = user;
    }

    public Comment getComment() {
        return comment;
    }

    public User getUser() {
        return user;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
