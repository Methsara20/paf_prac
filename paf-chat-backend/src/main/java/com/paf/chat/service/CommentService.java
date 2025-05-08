package com.paf.chat.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.chat.entities.Comment;
import com.paf.chat.repositories.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment save(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment getCommentById(String id) {
        return commentRepository.findById(id).orElseThrow();
    }

    public void deleteById(String id) {
        commentRepository.deleteById(id);
    }
}
