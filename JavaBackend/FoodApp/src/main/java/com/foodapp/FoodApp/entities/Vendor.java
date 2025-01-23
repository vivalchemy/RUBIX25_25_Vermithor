package com.foodapp.FoodApp.entities;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Vendor{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorId;

    private String name;
    private String address;
    private String shopName;
    private String location;
    private Double rating;

    @JsonBackReference(value = "vendor-order18")
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<Order> orders;

    @JsonBackReference(value = "vendor-order16")
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
    private List<Review> reviews;
}
