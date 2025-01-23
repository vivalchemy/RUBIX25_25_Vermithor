package com.foodapp.FoodApp.services;


import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.entities.Customer;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.Repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepository;

    @Autowired
    private CustomerRepo customerRepo;

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    // Add a new order
    @Transactional
    public Order createOrder(Order order) {


        return orderRepository.save(order);
    }

    // Update an existing order
    public Order updateOrder(Long orderId, Order orderDetails) {
        Optional<Order> existingOrderOpt = orderRepository.findById(orderId);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            existingOrder.setOrderTime(orderDetails.getOrderTime());
            existingOrder.setDeliveryTime(orderDetails.getDeliveryTime());
            existingOrder.setStatus(orderDetails.getStatus());
            existingOrder.setTotalPrice(orderDetails.getTotalPrice());
            existingOrder.setOrderItems(orderDetails.getOrderItems());
            return orderRepository.save(existingOrder);
        }
        return null; // Handle not found scenario
    }

    // Delete an order
    public boolean deleteOrder(Long orderId) {
        if (orderRepository.existsById(orderId)) {
            orderRepository.deleteById(orderId);
            return true;
        }
        return false;
    }
}
