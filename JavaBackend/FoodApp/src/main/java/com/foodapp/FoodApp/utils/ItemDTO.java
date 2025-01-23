package com.foodapp.FoodApp.utils;

import lombok.Data;

@Data
public class ItemDTO {
    private String name;
    private Double price;
    private Category category;
    private Long vendorId;
}
