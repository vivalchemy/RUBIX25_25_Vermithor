package com.foodapp.FoodApp.utils;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Data
public class OrderItemDTO {
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long orderItemId;
    private Long orderId;
    private Long itemId;
    private Integer quantity;
    private Double price;
}
