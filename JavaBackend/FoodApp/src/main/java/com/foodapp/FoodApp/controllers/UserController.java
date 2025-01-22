package com.foodapp.FoodApp.controllers;

import com.foodapp.FoodApp.entities.AuthRequest;
import com.foodapp.FoodApp.entities.UserInfo;
import com.foodapp.FoodApp.service.JwtService;
import com.foodapp.FoodApp.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserInfoService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @PostMapping("/signIn")
    public ResponseEntity<String> addNewUser(@RequestBody UserInfo userInfo) {
        // Print user info to console for debugging
        System.out.println(userInfo);

        // Add user using the service method
        String result = service.addUser(userInfo);

        // Return a ResponseEntity with the result and appropriate HTTP status
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.CREATED); // Success: 201 status
        } else {
            return new ResponseEntity<>("Error creating user", HttpStatus.BAD_REQUEST); // Error: 400 status
        }
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_VENDOR')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/generateToken")
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        System.out.println(authRequest);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        System.out.println("Came here");
        if (authentication.isAuthenticated()) {

            return jwtService.generateToken(authRequest.getUsername());
        } else {
            System.out.println("Exception");
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}
