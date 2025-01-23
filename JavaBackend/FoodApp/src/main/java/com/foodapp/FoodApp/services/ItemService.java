package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.Repo.ItemRepo;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    @Autowired
    private ItemRepo itemRepo;

    // Create a new Item
    public Item createItem(Item item) {
        return itemRepo.save(item);
    }

    // Get an Item by ID
    public Item getItem(Long id) {
        return itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }

    // Get all Items
    public List<Item> getAllItems() {
        return itemRepo.findAll();
    }

    // Delete an Item by ID
    public void deleteItem(Long id) {
        if (!itemRepo.existsById(id)) {
            throw new ResourceNotFoundException("Item not found");
        }
        itemRepo.deleteById(id);
    }

    // Update Item details
    public Item updateItem(Long id, Item item) {
        Item existingItem = getItem(id);
        existingItem.setName(item.getName());
        existingItem.setPrice(item.getPrice());
        existingItem.setCategory(item.getCategory());
        return itemRepo.save(existingItem);
    }
}
