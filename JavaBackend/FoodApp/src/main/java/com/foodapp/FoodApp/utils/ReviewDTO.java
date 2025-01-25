package com.foodapp.FoodApp.utils;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long customerId;
    private Long vendorId;
    private Long itemId;
    private String review;
    private Double rating;
    private String shortText;
    private String sentiment; // POSITIVE or NEGATIVE
    private Double confidence;
}
