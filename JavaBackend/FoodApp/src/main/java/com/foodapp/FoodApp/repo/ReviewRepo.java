package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review,Long> {
    List<Review> findByVendorVendorId(Long vendorId);
}
