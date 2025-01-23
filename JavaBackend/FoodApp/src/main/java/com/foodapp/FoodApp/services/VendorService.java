package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.entities.Customer;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Review;
import com.foodapp.FoodApp.entities.Vendor;
import com.foodapp.FoodApp.Repo.ItemRepo;
import com.foodapp.FoodApp.Repo.VendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepo vendorRepository;

    @Autowired
    private ItemRepo itemRepo;

    // Get all vendors
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // Get a vendor by ID
    public Optional<Vendor> getVendorById(Long vendorId) {
        return vendorRepository.findById(vendorId);
    }

    // Add a new vendor
    public Vendor addVendor(Vendor vendor) {
        PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
        String hasedPassword = passwordEncoder.encode(vendor.getPassword());
        vendor.setPassword(hasedPassword);
        return vendorRepository.save(vendor);
    }

    // Update an existing vendor
    public Vendor updateVendor(Long vendorId, Vendor vendorDetails) {
        return vendorRepository.findById(vendorId).map(vendor -> {
            vendor.setName(vendorDetails.getName());
            vendor.setAddress(vendorDetails.getAddress());
            vendor.setShopName(vendorDetails.getShopName());
            vendor.setLocation_lat(vendorDetails.getLocation_lat());    
            vendor.setLocation_lon(vendorDetails.getLocation_lon());    
            vendor.setRating(vendorDetails.getRating());
            return vendorRepository.save(vendor);
        }).orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
    }

    // Delete a vendor by ID
    public void deleteVendor(Long vendorId) {
        vendorRepository.deleteById(vendorId);
    }

    // Add an order to a vendor
    public Vendor addOrderToVendor(Long customerId, Order order) {
        Optional<Vendor> customerOptional = vendorRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Vendor vendor = customerOptional.get();
            vendor.getOrders().add(order);
            vendorRepository.save(vendor);
            return vendor;
        }
        return null;
    }

    // Add a review to a vendor
    public Vendor addReviewToVendor(Long customerId, Review review) {
        Optional<Vendor> customerOptional = vendorRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Vendor customer = customerOptional.get();
            customer.getReviews().add(review);
            vendorRepository.save(customer);
            return customer;
        }
        return null;
    }

    // ADD a Item to a vendor
    public Vendor addItemToVendor(Long itemID,Item item){
        Optional<Vendor> itemOptional = vendorRepository.findById(itemID);
        if(itemOptional.isPresent()){
            Vendor vendor = itemOptional.get();
            vendor.getItems().add(item);
            vendorRepository.save(vendor);
            return vendor;
        }
        return null;
    }

    public List<Item> findItemsById(Long ItemId){
        List<Item> items = itemRepo.findByVendorVendorId(ItemId);
        if(!items.isEmpty()){
            return items;
        }
        return null;
    }

}
