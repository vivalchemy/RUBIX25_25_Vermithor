package com.foodapp.FoodApp.utils;

import lombok.Data;

@Data
public class PaymentRequest {
    private String token;
    private double amount;
    private String currency;
}
