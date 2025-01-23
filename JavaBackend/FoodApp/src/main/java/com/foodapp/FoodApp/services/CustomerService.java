package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.entities.Customer;
import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.Repo.VendorRepo;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Review;
import com.foodapp.FoodApp.entities.UserRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private  CustomerRepo customerRepository;

    @Autowired
    private VendorRepo vendorRepo;
    
    

    // Create or update a customer
    public Customer saveCustomer(Customer customer) {
        PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
        String hasedPassword = passwordEncoder.encode(customer.getPassword());
        customer.setPassword(hasedPassword);
        return customerRepository.save(customer);
    }

    // Get a customer by ID
    public Optional<Customer> getCustomerById(Long customerId) {
        return customerRepository.findById(customerId);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Delete a customer by ID
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }

    // Find a customer by email
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    // Add an order to a customer
    public Customer addOrderToCustomer(Long customerId, Order order) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.getOrders().add(order);
            customerRepository.save(customer);
            return customer;
        }
        return null;
    }

    // Add a review to a customer
    public Customer addReviewToCustomer(Long customerId, Review review) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.getReviews().add(review);
            customerRepository.save(customer);
            return customer;
        }
        return null;
    }

    public boolean customerLogin(UserRequest userRequest){
        Customer customer = customerRepository.findByName(userRequest.getUsername());
        if(customer==null){
            return false;
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if(passwordEncoder.matches(customer.getPassword(), userRequest.getPassword())){
            return true;
        }
        return false;
    }
}

