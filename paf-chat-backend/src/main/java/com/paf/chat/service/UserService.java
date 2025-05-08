package com.paf.chat.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.paf.chat.config.JwtUtil;
import com.paf.chat.entities.Role;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String registerUser(String username, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already in use";
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Collections.singleton(Role.USER));

        userRepository.save(user);
        return "User registered successfully";
    }

    public String authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Invalid credentials";
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid credentials";
        }

        return jwtUtil.generateToken(email);
    }

    public String updateUserProfile(String currentEmail, String newUsername, String newEmail, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();

        if (!newEmail.equals(currentEmail) && userRepository.findByEmail(newEmail).isPresent()) {
            return "Email already in use";
        }

        user.setUsername(newUsername);
        user.setEmail(newEmail);

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
        return "Profile updated successfully";
    }
}
