package com.foodapp.FoodApp.utils;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderRequest {
    private Long customerId;
    private Long vendorId;
    private LocalDateTime orderTime;
    private LocalDateTime deliveryTime;
    private String status;
    private Double totalPrice;

}
