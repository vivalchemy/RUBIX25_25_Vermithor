package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepo extends JpaRepository<Vendor,Long> {
    Vendor findByName(String name);

    @Query("SELECT v FROM Vendor v JOIN v.items i WHERE i.id = :itemId")
    Vendor findVendorByItemId(Long itemId);
}
