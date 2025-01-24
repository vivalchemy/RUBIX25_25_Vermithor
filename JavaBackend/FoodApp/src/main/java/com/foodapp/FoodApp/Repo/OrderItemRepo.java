package com.foodapp.FoodApp.Repo;

import com.foodapp.FoodApp.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,Long> {
    List<OrderItem> findByOrderOrderId(Long orderId);

    List<OrderItem> findAll();
}
