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
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    
    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    
    @OneToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private LocalDateTime orderTime;
    private String status;
    private Double totalPrice;
    private Integer quantity;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @JsonIgnore   
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Delivery delivery;
}
