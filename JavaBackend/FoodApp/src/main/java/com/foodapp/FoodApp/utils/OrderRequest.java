package com.foodapp.FoodApp.utils;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderRequest {
    private Long customerId;
    private Long vendorId;
    private Long itemId;
    private LocalDateTime orderTime;
    private String status;
    private Double totalPrice;
    private Integer quantity;
}
