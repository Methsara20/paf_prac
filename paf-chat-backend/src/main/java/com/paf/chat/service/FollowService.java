package com.paf.chat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.chat.entities.Follow;
import com.paf.chat.entities.FollowStatus;
import com.paf.chat.repositories.FollowRepository;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public Follow follow(String followerId, String followingId) {
        if (!followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            Follow follow = new Follow(null, followerId, followingId, FollowStatus.PENDING);
            return followRepository.save(follow);
        }
        return null;
    }

    public List<Follow> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId);
    }

    public Follow acceptFollow(String followId) {
        Follow follow = followRepository.findById(followId).orElseThrow();
        follow.setStatus(FollowStatus.ACCEPTED);
        return followRepository.save(follow);
    }

    public List<Follow> getAcceptedFollowing(String userId) {
        return followRepository.findByFollowerIdAndStatus(userId, FollowStatus.ACCEPTED);
    }

    public List<Follow> getPendingRequests(String userId) {
        return followRepository.findByFollowingIdAndStatus(userId, FollowStatus.PENDING);
    }

    public FollowStatus getStatus(String followerId, String followingId) {
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .map(Follow::getStatus)
                .orElse(null);
    }

    public void unfollow(String followerId, String followingId) {
        followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .ifPresent(followRepository::delete);
    }
}
