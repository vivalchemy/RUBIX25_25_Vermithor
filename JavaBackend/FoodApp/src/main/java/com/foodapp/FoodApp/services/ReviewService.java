package com.foodapp.FoodApp.services;
import com.foodapp.FoodApp.entities.Vendor;

import com.foodapp.FoodApp.Repo.CustomerRepo;
import com.foodapp.FoodApp.Repo.ReviewRepo;
import com.foodapp.FoodApp.Repo.VendorRepo;
import com.foodapp.FoodApp.Repo.ItemRepo;
import com.foodapp.FoodApp.entities.Review;
import com.foodapp.FoodApp.exception.ResourceNotFoundException;
import com.foodapp.FoodApp.utils.ReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepo reviewRepository;
    @Autowired
    private CustomerRepo customerRepository;
    @Autowired
    private VendorRepo vendorRepository;
    @Autowired
    private ItemRepo itemRepository;
    @Autowired
    private VendorService vendorService;

    public Review createReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        Vendor vendor = vendorService.findVendorByItemId(reviewDTO.getItemId());
        
        review.setCustomer(customerRepository.findById(reviewDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found")));
        review.setVendor(vendorRepository.findById(vendor.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found")));
        review.setItem(itemRepository.findById(reviewDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found")));
        review.setReview(reviewDTO.getReview());
        review.setShortText(reviewDTO.getShortText());
        review.setSentiment(reviewDTO.getSentiment());
        review.setConfidence(reviewDTO.getConfidence());
        review.setRating(reviewDTO.getRating());
        review.setReviewDate(LocalDate.now());
        return reviewRepository.save(review);
    }

    public Review getReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    public List<Review> getVendorReviews(Long vendorId) {
        return reviewRepository.findByVendorVendorId(vendorId);
    }

    public List<Review> getItemReviews(Long itemId) {
        return reviewRepository.findByItemItemId(itemId);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review updateReview(Long id, ReviewDTO reviewDTO) {
        Review review = getReview(id);
        review.setReview(reviewDTO.getReview());
        review.setRating(reviewDTO.getRating());
        return reviewRepository.save(review);
    }
}
