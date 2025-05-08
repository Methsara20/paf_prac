package com.paf.chat.config;

import java.io.IOException;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.paf.chat.entities.Role;
import com.paf.chat.entities.User;
import com.paf.chat.repositories.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CustomOAuth2SuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name);
            newUser.setPassword("");
            newUser.setRoles(Set.of(Role.USER));
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(email);
        response.sendRedirect("http://localhost:3000/oauth-success?token=" + token);
    }
}
