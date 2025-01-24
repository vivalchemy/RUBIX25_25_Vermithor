package com.foodapp.FoodApp.config;

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
        return new StripeClient.StripeClientBuilder()
                .setApiKey(stripeSecretKey)
                .build();
    }
}