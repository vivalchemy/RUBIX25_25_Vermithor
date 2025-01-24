package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.Repo.VendorRepo;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Review;
import com.foodapp.FoodApp.entities.Vendor;
import com.foodapp.FoodApp.entities.VendorRequest;
import com.foodapp.FoodApp.services.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/vendors")
public class VendorController {

  @Autowired
  private VendorService vendorService;

  @Autowired
  private VendorRepo vendorRepo;

  private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  @PostMapping("/login")
  public ResponseEntity<?> loginVendor(@RequestBody VendorRequest vendorRequest) {
    Vendor vendor = vendorRepo.findByName(vendorRequest.getUsername());

    if (vendor == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    if (passwordEncoder.matches(vendorRequest.getPassword(), vendor.getPassword())) {
      return ResponseEntity.ok(vendor);
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
  }

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

  @GetMapping("/items/{id}")
  public ResponseEntity<List<Item>> getItems(@PathVariable Long id) {
    List<Item> items = vendorService.findItemsById(id);
    if (items != null) {
      return ResponseEntity.ok(items);
    } else {
      return ResponseEntity.notFound().build();
    }
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

  @PostMapping("/{id}/addItem")
  public ResponseEntity<Vendor> addItemTo(@PathVariable Long id, @RequestBody Item item) {
    Vendor upVendor = vendorService.addItemToVendor(id, item);
    if (upVendor != null) {
      return ResponseEntity.ok(upVendor);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/{id}/addOrder")
  public ResponseEntity<Vendor> addOrdeTor(@PathVariable Long id, @RequestBody Order order) {
    Vendor upVendor = vendorService.addOrderToVendor(id, order);
    if (upVendor != null) {
      return ResponseEntity.ok(upVendor);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/{id}/addReview")
  public ResponseEntity<Vendor> addReviewTo(@PathVariable Long id, @RequestBody Review order) {
    Vendor upVendor = vendorService.addReviewToVendor(id, order);
    if (upVendor != null) {
      return ResponseEntity.ok(upVendor);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/item/{id}")
  public ResponseEntity<Vendor> getByItemId12(@PathVariable Long id){
    Vendor vendor = vendorService.findVendorByItemId(id);
    if (vendor != null) {
      return ResponseEntity.ok(vendor);
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
