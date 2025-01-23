package com.foodapp.FoodApp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Customer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long customerId;

  private String name;
  private String email;
  private String phone;
  private String address;
  private String password;
  @JsonIgnore
  @JsonManagedReference(value = "vendor-order12")
  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
  private List<Order> orders;
  @JsonIgnore
  @JsonManagedReference(value = "vendor-order13")
  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
  private List<Review> reviews;
}
