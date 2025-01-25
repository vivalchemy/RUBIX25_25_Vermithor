package com.foodapp.FoodApp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private String review;
    private Double rating;
    private LocalDate reviewDate;
    private String shortText;
    private String sentiment; // POSITIVE or NEGATIVE
    private Double confidence;
}

