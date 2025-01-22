package com.foodapp.FoodApp.utils;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long orderItemId;
    private Long orderId;
    private Long itemId;
    private Integer quantity;
    private Double price;
}
