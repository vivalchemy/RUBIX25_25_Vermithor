package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.entities.OrderItem;
import com.foodapp.FoodApp.utils.OrderItemDTO;
import com.foodapp.FoodApp.services.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    // Create a new OrderItem
    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItemDTO orderItemDTO) {

        return new ResponseEntity<>(orderItemService.createOrderItem(orderItemDTO), HttpStatus.CREATED);
    }

    // Get all OrderItems
    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        List<OrderItem> orderItemsDTO = orderItemService.getALLOrderItem();
        return new ResponseEntity<>(orderItemsDTO, HttpStatus.OK);
    }
//
//    // Get OrderItem by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<OrderItemDTO> getOrderItemById(@PathVariable("id") Long id) {
//        Optional<OrderItemDTO> orderItemDTO = orderItemService.getOrderItemById(id);
//        return orderItemDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }

    // Update an existing OrderItem
//    @PutMapping("/{id}")
//    public ResponseEntity<OrderItemDTO> updateOrderItem(@PathVariable("id") Long id, @RequestBody OrderItemDTO updatedOrderItemDTO) {
//        OrderItemDTO orderItemDTO = orderItemService.updateOrderItem(id, updatedOrderItemDTO);
//        if (orderItemDTO != null) {
//            return new ResponseEntity<>(orderItemDTO, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    // Delete an OrderItem
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable("id") Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}
