package com.foodapp.FoodApp.entities;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import org.hibernate.annotations.NaturalId;

@Entity
@Data
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorId;
    
    @Column(unique = true,nullable = false)
    @NaturalId
    private String name;
    private String email;
    private String address;
    private String shopName;
    private double location_lat;
    private double location_lon;
    private Double rating = 0.0;
    private String password;
    @JsonIgnore
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @JsonIgnore
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<Order> orders;

    @JsonIgnore
    @OneToMany(mappedBy = "vendor",cascade =CascadeType.ALL)
    private  List<Item> items;
}
