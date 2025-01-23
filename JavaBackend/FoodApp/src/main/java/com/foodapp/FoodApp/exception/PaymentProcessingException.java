package com.foodapp.FoodApp.exception;
public class PaymentProcessingException extends RuntimeException {
    private String errorCode;
    private String stripeErrorType;

    // Constructor with message
    public PaymentProcessingException(String message) {
        super(message);
    }

    // Constructor with message and error details
    public PaymentProcessingException(String message, String errorCode, String stripeErrorType) {
        super(message);
        this.errorCode = errorCode;
        this.stripeErrorType = stripeErrorType;
    }

    // Getters for additional error details
    public String getErrorCode() {
        return errorCode;
    }

    public String getStripeErrorType() {
        return stripeErrorType;
    }
}
