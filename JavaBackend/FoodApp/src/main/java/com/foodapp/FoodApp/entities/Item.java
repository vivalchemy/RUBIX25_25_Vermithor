package com.foodapp.FoodApp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.foodapp.FoodApp.utils.Category;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String name;
    private Double price;
    private Category category;  //  DRAFTED,ARCHIVED,READY
    private Double rating;
    private String description;
    private String imgLink;
    private Integer timeToArrive;
    private Integer peopleRequired;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="vendor_id",nullable = false)
    private Vendor vendor;
}
