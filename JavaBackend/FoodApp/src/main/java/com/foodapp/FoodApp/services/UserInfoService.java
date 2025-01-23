//package com.foodapp.FoodApp.services;
//
//import com.foodapp.FoodApp.Repo.UserInfoRepository;
//import com.foodapp.FoodApp.entities.Customer;
//
//import com.foodapp.FoodApp.Repo.UserInfoRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//@Service
//public class UserInfoService implements UserDetailsService {
//    @Autowired
//    private UserInfoRepository repository;
//    @Autowired
//    private PasswordEncoder encoder;
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        System.out.println("Searching for user with email: " + username);
//        Optional<Customer> userDetails = repository.findByName(username);
//        System.out.println("User found: " + userDetails.isPresent());
//        System.out.println(userDetails);
//        return userDetails.map(UserInfoDetails::new).orElseThrow(()->new UsernameNotFoundException("User Not Found: "+username));
//    }
//
//    public String addUser(Customer userInfo){
//        System.out.println("came here");
//        System.out.println(userInfo);
//        if (repository.findByName(userInfo.getName()).isPresent()) {
//            throw new IllegalArgumentException("User already exists with name: " + userInfo.getName());
//        }
//        userInfo.setPassword(encoder.encode(userInfo.getPassword()));
//        repository.save(userInfo);
//        return "User Added Successfully";
//    }
//}
