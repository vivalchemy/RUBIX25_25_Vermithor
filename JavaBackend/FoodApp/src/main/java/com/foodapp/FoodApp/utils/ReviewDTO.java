package com.foodapp.FoodApp.utils;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long customerId;
    private Long vendorId;
    private String reviewText;
    private Double rating;
}
