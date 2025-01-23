package com.foodapp.FoodApp.entities;

import jakarta.persistence.Entity;
import lombok.Data;

@Data

public class VendorRequest {
    private String username;
    private String password;
}
