package com.foodapp.FoodApp.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderId;

  @JsonIgnore
  @JsonBackReference(value = "customer-orders")
  @ManyToOne
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @JsonIgnore
  @JsonBackReference(value = "vendor-orders")
  @ManyToOne
  @JoinColumn(name = "vendor_id", nullable = false)
  private Vendor vendor;

  private LocalDateTime orderTime;
  private LocalDateTime deliveryTime;
  private String status;
  private Double totalPrice;

  @JsonIgnore
  @JsonManagedReference(value = "order-items")
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
  private List<OrderItem> orderItems;

  @JsonIgnore
  @JsonManagedReference(value = "order-delivery")
  @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
  private Delivery delivery;
}
