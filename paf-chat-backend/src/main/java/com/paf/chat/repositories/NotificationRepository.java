package com.paf.chat.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf.chat.entities.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByTimestampDesc(String userId);
}
