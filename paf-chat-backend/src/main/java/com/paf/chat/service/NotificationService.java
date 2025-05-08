package com.paf.chat.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.chat.entities.Notification;
import com.paf.chat.repositories.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(String userId, String message) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notis = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
        notis.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notis);
    }
}
