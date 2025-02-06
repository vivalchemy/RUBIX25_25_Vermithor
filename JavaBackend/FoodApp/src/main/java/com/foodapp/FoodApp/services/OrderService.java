package com.foodapp.FoodApp.services;


import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.entities.Customer;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.Repo.OrderRepo;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.Repo.ItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepository;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private ItemRepo itemRepository;

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
            existingOrder.setStatus(orderDetails.getStatus());
            existingOrder.setTotalPrice(orderDetails.getTotalPrice());
            existingOrder.setOrderItems(orderDetails.getOrderItems());
            return orderRepository.save(existingOrder);
        }
        return null; // Handle not found scenario
    }

    public Order updateOrderQuantity(Long orderId, Integer orderQuantity, String status) {
        Optional<Order> existingOrderOpt = orderRepository.findById(orderId);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            Item item = itemRepository.findById(existingOrder.getItem().getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

            existingOrder.setQuantity(orderQuantity);
            existingOrder.setTotalPrice(item.getPrice() * orderQuantity);
            existingOrder.setOrderTime(LocalDateTime.now());
            existingOrder.setStatus(status);
            return orderRepository.save(existingOrder);
        }
        return null; // Handle not found scenario
    
    }
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> existingOrderOpt = orderRepository.findById(orderId);
        if (existingOrderOpt.isPresent()) {
            Order existingOrder = existingOrderOpt.get();
            Item item = itemRepository.findById(existingOrder.getItem().getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

            // existingOrder.setQuantity(orderQuantity);
            // existingOrder.setTotalPrice(item.getPrice() * orderQuantity);
            existingOrder.setOrderTime(LocalDateTime.now());
            existingOrder.setStatus(status);
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

    public List<Order> getOrderbyCustomerId(Long customerId){
        return orderRepository.findByCustomer_CustomerId(customerId);
    }

    public Order getOrderByCustomerIdAndItemId(Long customerId,Long itemId){
        return orderRepository.findByCustomer_CustomerIdAndItem_ItemId(customerId, itemId);
    }
}
