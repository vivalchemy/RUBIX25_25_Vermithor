package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.exception.PaymentProcessingException;
import com.foodapp.FoodApp.utils.PaymentRequest;
import com.foodapp.FoodApp.utils.PaymentResponse;
import com.stripe.StripeClient;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StripeService {
    @Autowired
    private StripeClient stripeClient;

    public PaymentResponse processPayment(PaymentRequest request) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(Math.round(request.getAmount() * 100L))
                    .setCurrency(request.getCurrency())
                    .setPaymentMethod(request.getToken())
                    .setConfirm(true)
                    .build();

            PaymentIntent paymentIntent = stripeClient.paymentIntents().create(params);

            return new PaymentResponse(
                    paymentIntent.getId(),
                    paymentIntent.getStatus()
            );
        } catch (StripeException e) {
            throw new PaymentProcessingException(e.getMessage());
        }
    }
}