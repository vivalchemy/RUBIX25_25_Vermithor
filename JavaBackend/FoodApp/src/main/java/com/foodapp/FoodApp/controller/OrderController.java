// OrderController.java
package com.foodapp.FoodApp.controller;

import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.Repo.OrderRepo;
import com.foodapp.FoodApp.Repo.VendorRepo;
import com.foodapp.FoodApp.Repo.ItemRepo;
import com.foodapp.FoodApp.entities.Order;
import com.foodapp.FoodApp.entities.Item;
import com.foodapp.FoodApp.services.OrderService;
import com.foodapp.FoodApp.utils.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private CustomerRepo customerRepository;
    @Autowired
    private VendorRepo vendorRepository;
    @Autowired
    private ItemRepo itemRepository;
    @Autowired
    private OrderRepo orderRepository;
    @Autowired
    private OrderService orderService;

    // Get all orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Create a new order
    @PostMapping
    public Order createOrder(@RequestBody OrderRequest orderDTO) {
        Order order = new Order();
        Item item = itemRepository.findById(orderDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
             

        order.setCustomer(customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found")));
        order.setVendor(vendorRepository.findById(orderDTO.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found")));
        order.setItem(itemRepository.findById(orderDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found")));
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(orderDTO.getStatus());
        order.setTotalPrice(item.getPrice() * orderDTO.getQuantity());
        order.setQuantity(orderDTO.getQuantity());
        return orderRepository.save(order);
    }

    // Update an existing order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderService.deleteOrder(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/customer/{id}")
    public List<Order> getOrderByCustomerId(@PathVariable Long id){
        return orderService.getOrderbyCustomerId(id);
    }


    @GetMapping("/customer/{customerId}/item/{itemId}")
    public List<Order> getOrderByCustomerIdAndItemId(@PathVariable Long customerId,@PathVariable Long itemId){
        return orderService.getOrderByCustomerIdAndItemId(customerId, itemId);
    }
}
