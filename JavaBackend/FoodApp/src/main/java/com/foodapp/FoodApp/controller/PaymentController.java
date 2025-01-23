package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.services.StripeService;
import com.foodapp.FoodApp.utils.PaymentRequest;
import com.foodapp.FoodApp.utils.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    @Autowired
    private StripeService stripeService;

    @PostMapping("/charge")
    public ResponseEntity<PaymentResponse> processPayment(
            @RequestBody PaymentRequest request
    ) {
        PaymentResponse response = stripeService.processPayment(request);
        return ResponseEntity.ok(response);
    }
}
