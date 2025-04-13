package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.entities.Customer;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Review;
import com.foodapp.FoodApp.entities.UserRequest;
import com.foodapp.FoodApp.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private final CustomerService customerService;
    @Autowired
    private CustomerRepo customerRepo;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Create or update a customer
    @PostMapping
    public ResponseEntity<Customer> createOrUpdateCustomer(@RequestBody Customer customer) {
        
        Customer savedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody UserRequest userRequest){
        Customer customer = customerRepo.findByName(userRequest.getUsername());

        if (customer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        if (passwordEncoder.matches(userRequest.getPassword(), customer.getPassword())) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    // Get a customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Delete a customer by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    // Find a customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Optional<Customer> customer = customerService.getCustomerByEmail(email);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add an order to a customer
    @PostMapping("/{customerId}/orders")
    public ResponseEntity<Customer> addOrderToCustomer(
            @PathVariable Long customerId,
            @RequestBody Order order) {
        Customer updatedCustomer = customerService.addOrderToCustomer(customerId, order);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add a review to a customer
    @PostMapping("/{customerId}/reviews")
    public ResponseEntity<Customer> addReviewToCustomer(
            @PathVariable Long customerId,
            @RequestBody Review review) {
        Customer updatedCustomer = customerService.addReviewToCustomer(customerId, review);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
