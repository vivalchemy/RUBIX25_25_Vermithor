package com.foodapp.FoodApp.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String paymentIntentId;
    private String status;
}
