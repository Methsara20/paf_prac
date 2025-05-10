package com.paf.chat.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf.chat.entities.Follow;
import com.paf.chat.entities.FollowResponse;
import com.paf.chat.entities.FollowStatus;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.FollowRepository;
import com.paf.chat.repositories.UserRepository;
import com.paf.chat.service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @PostMapping("/{userId}")
    public Follow sendFollowRequest(@PathVariable String userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        User following = userRepository.findById(userId).orElseThrow();
        return followService.follow(follower.getId(), following.getId());
    }

    @PostMapping("/accept/{followId}")
    public Follow acceptFollow(@PathVariable String followId) {
        return followService.acceptFollow(followId);
    }

    @GetMapping("/requests")
    public List<FollowResponse> getPendingRequests(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return followService.getPendingRequests(user.getId()).stream()
                .map(f -> {
                    User follower = userRepository.findById(f.getFollowerId()).orElse(null);
                    return new FollowResponse(f.getId(), follower);
                }).toList();
    }

    @GetMapping("/status/{userId}")
    public Map<String, String> getFollowStatus(@PathVariable String userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        FollowStatus status = followService.getStatus(follower.getId(), userId);
        return Map.of("status", status != null ? status.name() : "NONE");
    }

    @GetMapping("/counts")
    public Map<String, Integer> getCounts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        int followers = followRepository.findByFollowingIdAndStatus(user.getId(), FollowStatus.ACCEPTED).size();
        int following = followRepository.findByFollowerIdAndStatus(user.getId(), FollowStatus.ACCEPTED).size();
        return Map.of("followers", followers, "following", following);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollow(@PathVariable String userId, Principal principal) {
        User follower = userRepository.findByEmail(principal.getName()).orElseThrow();
        followService.unfollow(follower.getId(), userId);
        return ResponseEntity.ok().build();
    }
}
