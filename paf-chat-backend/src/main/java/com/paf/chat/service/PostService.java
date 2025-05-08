package com.paf.chat.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.paf.chat.entities.Post;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.PostRepository;
import com.paf.chat.repositories.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Post save(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post getPostById(String postId) {
        return postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post updatePostWithMedia(String postId, String userEmail, String title, String description, List<String> newMediaPaths) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        if (!post.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized to update this post");
        }

        post.setTitle(title);
        post.setDescription(description);

        if (newMediaPaths != null && !newMediaPaths.isEmpty()) {
            // Delete old media files
            for (String oldPath : post.getMediaPaths()) {
                try {
                    Path filePath = Paths.get("src/main/resources/static" + oldPath);
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            post.setMediaPaths(newMediaPaths);
        }

        return postRepository.save(post);
    }

    public void deletePostByIdAndUser(String postId, String email) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!post.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized to delete this post");
        }

        for (String mediaPath : post.getMediaPaths()) {
            try {
                Path filePath = Paths.get("src/main/resources/static" + mediaPath);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        postRepository.delete(post);
    }

    public Post toggleLike(String postId, String userEmail) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User liker = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyLiked = post.getLikedBy().contains(liker.getId());

        if (alreadyLiked) {
            post.getLikedBy().remove(liker.getId());
        } else {
            post.getLikedBy().add(liker.getId());

            if (!post.getUserId().equals(liker.getId())) {
                User postOwner = userRepository.findById(post.getUserId()).orElse(null);
                if (postOwner != null) {
                    String message = liker.getUsername() + " liked your post: " + post.getTitle();
                    notificationService.createNotification(postOwner.getId(), message);
                }
            }
        }

        return postRepository.save(post);
    }

    public boolean isLikedByUser(String postId, String userEmail) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        return post.getLikedBy().contains(user.getId());
    }

    public Post getPostByIdForUser(String postId, String email) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!post.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized access to post");
        }

        return post;
    }

}
