// AuthRequest.ts
export interface AuthRequest {
  username: string;
  password: string;
}

// Customer.ts
export interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  password: string;
  orders?: Order[];
  reviews?: Review[];
}

// Delivery.ts
export interface Delivery {
  deliveryId: number;
  order: Order;
  deliveryPersonName: string;
  deliveryVehicle: string;
  route: string;
  estimatedTime: string; // Converted from LocalDateTime
}

// Item.ts
export interface Item {
  itemId: number;
  name: string;
  price: number;
  category: string;
}

// OrderItem.ts
export interface OrderItem {
  orderItemId: number;
  order: Order;
  item: Item;
  quantity: number;
  price: number;
}

// Order.ts
export interface Order {
  orderId: number;
  customer: Customer;
  vendor: Vendor;
  orderTime: string; // Converted from LocalDateTime
  deliveryTime: string; // Converted from LocalDateTime
  status: string;
  totalPrice: number;
  orderItems?: OrderItem[];
  delivery?: Delivery;
}

// Review.ts
export interface Review {
  reviewId: number;
  customer: Customer;
  vendor: Vendor;
  reviewText: string;
  rating: number;
  reviewDate: string; // Converted from LocalDate
}

// Vendor.ts
export interface Vendor {
  vendorId: number;
  name: string;
  email: string;
  password: string;
  address: string;
  shopName: string;
  location: string;
  rating: number;
  imageUrl: string;
  orders?: Order[];
  reviews?: Review[];
}
