package com.foodapp.FoodApp.services;

import com.foodapp.FoodApp.Repo.OrderItemRepo;
import com.foodapp.FoodApp.Repo.OrderRepo;
import com.foodapp.FoodApp.Repo.ItemRepo;
import com.foodapp.FoodApp.entities.OrderItem;
import com.foodapp.FoodApp.exception.ResourceNotFoundException;
import com.foodapp.FoodApp.utils.OrderItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ItemRepo itemRepo;

    // Create a new OrderItem
    public OrderItem createOrderItem(OrderItemDTO orderItemDTO) {
        // Fetching Order and Item based on IDs
        var order = orderRepo.findById(orderItemDTO.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        var item = itemRepo.findById(orderItemDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        // Creating and setting OrderItem entity
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setItem(item);
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setPrice(orderItemDTO.getPrice());

        // Saving the OrderItem and returning it
        return orderItemRepo.save(orderItem);
    }

    // Fetch OrderItem by ID
    public OrderItem getOrderItem(Long id) {
        return orderItemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found"));
    }

    public List<OrderItem> getALLOrderItem(){
        return orderItemRepo.findAll();
    }

    // Get all OrderItems for a particular Order
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepo.findByOrderOrderId(orderId);
    }



    // Delete an OrderItem by ID
    public void deleteOrderItem(Long id) {
        if (!orderItemRepo.existsById(id)) {
            throw new ResourceNotFoundException("OrderItem not found");
        }
        orderItemRepo.deleteById(id);
    }

    // Update OrderItem details
    public OrderItem updateOrderItem(Long id, OrderItemDTO orderItemDTO) {
        // Fetch the OrderItem from the DB
        OrderItem orderItem = getOrderItem(id);

        // Update OrderItem properties
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setPrice(orderItemDTO.getPrice());

        // Save updated OrderItem and return it
        return orderItemRepo.save(orderItem);
    }
}
