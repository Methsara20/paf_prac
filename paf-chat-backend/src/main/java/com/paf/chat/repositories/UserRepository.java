package com.paf.chat.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf.chat.entities.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
}
