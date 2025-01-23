package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.entities.Vendor;
import com.foodapp.FoodApp.services.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    // Get all vendors
    @GetMapping
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }

    // Get a vendor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable("id") Long vendorId) {
        return vendorService.getVendorById(vendorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new vendor
    @PostMapping
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.addVendor(vendor));
    }

    // Update an existing vendor
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable("id") Long vendorId, @RequestBody Vendor vendorDetails) {
        try {
            return ResponseEntity.ok(vendorService.updateVendor(vendorId, vendorDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a vendor by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable("id") Long vendorId) {
        vendorService.deleteVendor(vendorId);
        return ResponseEntity.noContent().build();
    }
}
