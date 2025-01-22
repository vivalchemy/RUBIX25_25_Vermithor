package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.entities.Vendor;
import com.foodapp.FoodApp.Repo.VendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepo vendorRepository;

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
        return vendorRepository.save(vendor);
    }

    // Update an existing vendor
    public Vendor updateVendor(Long vendorId, Vendor vendorDetails) {
        return vendorRepository.findById(vendorId).map(vendor -> {
            vendor.setName(vendorDetails.getName());
            vendor.setAddress(vendorDetails.getAddress());
            vendor.setShopName(vendorDetails.getShopName());
            vendor.setLocation(vendorDetails.getLocation());
            vendor.setRating(vendorDetails.getRating());
            return vendorRepository.save(vendor);
        }).orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
    }

    // Delete a vendor by ID
    public void deleteVendor(Long vendorId) {
        vendorRepository.deleteById(vendorId);
    }
}
