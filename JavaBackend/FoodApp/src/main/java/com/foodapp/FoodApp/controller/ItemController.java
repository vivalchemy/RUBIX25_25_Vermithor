package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.Repo.VendorRepo;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.services.ItemService;
import com.foodapp.FoodApp.utils.ItemDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private VendorRepo vendorRepository;

    // Create a new Item
    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody ItemDTO ItemDto) {

        Item createdItem = new Item();
        createdItem.setName(ItemDto.getName());
        createdItem.setPrice(ItemDto.getPrice());
        createdItem.setCategory(ItemDto.getCategory());
        createdItem.setRating(ItemDto.getRating());
        createdItem.setVendor(vendorRepository.findById(ItemDto.getVendorId()).orElseThrow(() -> new RuntimeException("Customer not found")));
        Item mainItem = itemService.createItem(createdItem);
        return new ResponseEntity<>(mainItem, HttpStatus.CREATED);
    }

    // Get Item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        Item item = itemService.getItem(id);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    // Get all Items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    // Update Item
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item item) {
        Item updatedItem = itemService.updateItem(id, item);
        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }

    // Delete Item by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
