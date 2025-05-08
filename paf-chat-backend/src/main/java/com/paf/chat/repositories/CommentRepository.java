package com.paf.chat.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf.chat.entities.Comment;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostId(String postId);
}
