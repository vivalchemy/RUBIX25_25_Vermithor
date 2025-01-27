package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {
    Item findByItemItemId(Long id);
}
