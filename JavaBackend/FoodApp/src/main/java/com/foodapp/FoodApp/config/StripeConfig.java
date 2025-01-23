package com.foodapp.FoodApp.config;

import com.stripe.Stripe;
import com.stripe.StripeClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Bean
    public StripeClient stripeClient() {
        Stripe.apiKey = stripeSecretKey;
        return new StripeClient(stripeSecretKey);
    }
}