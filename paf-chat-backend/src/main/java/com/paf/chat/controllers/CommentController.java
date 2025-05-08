package com.paf.chat.controllers;

import com.paf.chat.entities.Comment;
import com.paf.chat.entities.CommentResponse;
import com.paf.chat.entities.Post;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.PostRepository;
import com.paf.chat.repositories.UserRepository;
import com.paf.chat.service.CommentService;
import com.paf.chat.service.NotificationService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/{postId}")
    public Comment addComment(@PathVariable String postId,
            @RequestBody Comment comment,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        comment.setUserId(user.getId());
        comment.setPostId(post.getId());
        Comment saved = commentService.save(comment);

        // 🔔 Send notification to post owner (if not commenting on their own post)
        if (!post.getUserId().equals(user.getId())) {
            String message = user.getUsername() + " commented on your post";
            notificationService.createNotification(post.getUserId(), message);
        }

        return saved;
    }

    @GetMapping("/{postId}")
    public List<CommentResponse> getComments(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return comments.stream()
                .map(comment -> {
                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    return new CommentResponse(comment, user);
                })
                .toList();
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable String commentId,
            @RequestBody Map<String, String> request,
            Principal principal) {
        Comment comment = commentService.getCommentById(commentId);
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        if (!comment.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        comment.setContent(request.get("content"));
        return ResponseEntity.ok(commentService.save(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId, Principal principal) {
        Comment comment = commentService.getCommentById(commentId);
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        boolean isOwner = comment.getUserId().equals(user.getId());
        if (isOwner) {
            commentService.deleteById(commentId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }

}
