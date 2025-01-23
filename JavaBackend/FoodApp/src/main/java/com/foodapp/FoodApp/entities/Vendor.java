package com.foodapp.FoodApp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Vendor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long vendorId;

  private String name;
  private String email;
  private String password;
  private String address;
  private String shopName;
  private String location;
  private Double rating = 0.0;
  private String imageUrl;

  @JsonIgnore
  @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
  private List<Order> orders;

  @JsonIgnore
  @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL)
  private List<Review> reviews;
}
