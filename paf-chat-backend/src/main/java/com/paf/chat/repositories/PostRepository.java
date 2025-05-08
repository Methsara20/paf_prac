package com.paf.chat.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf.chat.entities.Post;

public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findByUserId(String userId);

    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
}
