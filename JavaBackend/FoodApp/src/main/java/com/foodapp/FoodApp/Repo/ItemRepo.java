package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.entities.Review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepo extends JpaRepository<Item,Long> {
    List<Item> findByVendorVendorId(Long vendorId);
}
