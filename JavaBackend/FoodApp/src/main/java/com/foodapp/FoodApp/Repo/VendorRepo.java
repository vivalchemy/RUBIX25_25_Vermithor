package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepo extends JpaRepository<Vendor,Long> {
    Vendor findByName(String name);
}
