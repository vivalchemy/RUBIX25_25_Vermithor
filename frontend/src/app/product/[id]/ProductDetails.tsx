"use client";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/lib/types";
import { Clock, Rotate3d, ShoppingCart, Star, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Vendor } from "@/lib/types/Vendor";

const arLinks: Record<string, string> = {
  banana: "https://mywebar.com/p/Banana-ud",
  bread: "https://mywebar.com/p/Bread",
  eggs: "https://mywebar.com/p/Eggs",
  milk: "https://mywebar.com/p/milk",
  apple: "https://mywebar.com/p/apple-",
};

function ProductDetails({ id }: { id: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [arLinkOfProduct, setArLinkOfProduct] = useState("");
  const [product, setProduct] = useState<ProductType | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [orderId, setOrderId] = useState(0);

  async function fetchCartDetails(itemId: string | undefined, customerId: string | null) {
    try {
      const response = await axios.get(`/api/orders/customer/${customerId}/item/${itemId}`);
      console.log(response.data.quantity);
      setQuantity(response.data.quantity || 0);
      setOrderId(response.data.orderId || 0);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  }

  async function handleAddToCart(itemId: string | undefined) {
    if (!itemId) return;
    if (quantity === 0) {
      try {
        const response = await axios.post(`/api/orders`, {
          customerId: localStorage.getItem("customerId"),
          vendorId: vendor?.vendorId,
          itemId: itemId,
          status: "pending",
          quantity: 1,
        });
        setQuantity(1); // Set initial quantity
        console.log("Order successfully added:", response.data);
      } catch (error) {
        console.error("Error adding order:", error);
      }
    }
  }

  async function updateCartQuantity(itemId: string | undefined, newQuantity: number) {
    if (!itemId) return;

    if (newQuantity === 0) {
      try {
        await axios.delete(`/api/orders/${orderId}`);
        setQuantity(0);
        console.log("Item successfully removed from the cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      try {
        await axios.patch(`/api/orders/quantity/${orderId}?quantity=${newQuantity}&status=pending`);
        setQuantity(newQuantity);
        console.log("Order quantity successfully updated");
        window.location.reload();
      } catch (error) {
        console.error("Error updating order quantity:", error);
      }
    }
  }

  useEffect(() => {
    // Fetch product and vendor details
    const fetchProductandVendor = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setProduct(response.data);

        const vendorResponse = await axios.get(`/api/vendors/item/${id}`);
        setVendor(vendorResponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductandVendor();
  }, [id]);

  useEffect(() => {
    // Fetch cart details for the current product
    const customerId = localStorage.getItem("customerId");
    fetchCartDetails(id, customerId);
  }, [id]);

  useEffect(() => {
    // Find AR link
    const arLink = product?.name
      .toLowerCase()
      .split(" ")
      .reduce<string | null>((link, word) => {
        if (link) return link; // If link is already found, return it
        return word in arLinks ? arLinks[word] : null; // Otherwise, check the current word
      }, null);

    setArLinkOfProduct(arLink || "");
    console.log(arLink);
  }, [product]);

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="relative rounded-lg overflow-hidden shadow-lg group">
        <img
          src={product?.imgLink || "/api/placeholder/800/600"}
          alt={product?.name}
          className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`}
          />
        </Button>
      </div>

      <div className="space-y-6 lg:py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-base">{vendor?.shopName}</span>
            <span className="text-lg">·</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{product?.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>

          <div className="flex flex-wrap gap-3 pt-1">
            <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {product?.timeToArrive} min
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Serves {product?.peopleRequired}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-base leading-relaxed">
            {product?.description ||
              "Experience the perfect blend of flavors with our signature dish, crafted with premium ingredients and prepared to perfection."}
          </p>

          <div className="text-2xl font-bold text-gray-900">${product?.price}</div>

          <div className="flex gap-3 pt-2">
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => updateCartQuantity(product?.itemId, quantity - 1)}
                >
                  -
                </Button>
                <span className="text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => updateCartQuantity(product?.itemId, quantity + 1)}
                >
                  +
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleAddToCart(product?.itemId)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            )}
            <Button
              variant="outline"
              className="px-4"
              onClick={() => {
                window.open(`${arLinkOfProduct}`, "_blank");
              }}
            >
              <Rotate3d className="h-4 w-4" />
              View in AR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
