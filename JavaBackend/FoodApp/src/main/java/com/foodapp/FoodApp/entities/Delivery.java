package com.foodapp.FoodApp.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String deliveryPersonName;
    private String deliveryVehicle;
    private String route;
    private LocalDateTime estimatedTime;
}
