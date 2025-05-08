package com.paf.chat.controllers;

import com.paf.chat.entities.Post;
import com.paf.chat.entities.PostResponse;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.PostRepository;
import com.paf.chat.repositories.UserRepository;
import com.paf.chat.service.FollowService;
import com.paf.chat.service.PostService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private PostService postService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private FollowService followService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Post> createPost(@RequestPart String title,
            @RequestPart String description,
            @RequestPart MultipartFile[] files,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        List<String> paths = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            try {
                Path filePath = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add("/uploads/" + filename);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setMediaPaths(paths);
        post.setUserId(user.getId());

        return ResponseEntity.ok(postService.save(post));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable String postId, Principal principal) {
        return ResponseEntity.ok(postService.toggleLike(postId, principal.getName()));
    }

    @GetMapping("/{postId}/like-status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(@PathVariable String postId, Principal principal) {
        Post post = postService.getPostById(postId);
        boolean liked = postService.isLikedByUser(postId, principal.getName());
        return ResponseEntity.ok(Map.of("liked", liked, "likeCount", post.getLikedBy().size()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, Principal principal) {
        postService.deletePostByIdAndUser(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public PostResponse getPostById(@PathVariable String postId) {
        Post post = postService.getPostById(postId);
        User user = userRepository.findById(post.getUserId()).orElse(null);
        return new PostResponse(post, user);
    }

    @GetMapping("/my")
    public List<PostResponse> getMyPosts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return postService.getPostsByUserId(user.getId()).stream()
                .map(post -> new PostResponse(post, user))
                .toList();
    }

    @GetMapping("/all")
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts().stream()
                .map(post -> {
                    User user = userRepository.findById(post.getUserId()).orElse(null);
                    return new PostResponse(post, user);
                })
                .toList();
    }

    @GetMapping("/following")
    public List<PostResponse> getFollowingPosts(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<String> followingIds = followService.getAcceptedFollowing(user.getId())
                .stream().map(f -> f.getFollowingId()).toList();

        return postRepository.findByUserIdInOrderByCreatedAtDesc(followingIds).stream()
                .map(post -> {
                    User u = userRepository.findById(post.getUserId()).orElse(null);
                    return new PostResponse(post, u);
                })
                .toList();
    }

    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Post> updatePost(
            @PathVariable String postId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            Principal principal) {

        List<String> paths = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                try {
                    Path filePath = Paths.get(uploadDir, filename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    paths.add("/uploads/" + filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        Post updatedPost = postService.updatePostWithMedia(postId, principal.getName(), title, description, paths);
        return ResponseEntity.ok(updatedPost);
    }
}
