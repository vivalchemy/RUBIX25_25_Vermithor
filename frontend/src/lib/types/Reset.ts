export interface Customer {
  customerId?: number;
  name: string;
  email: string;
  password: string;
  address?: string;
  orders?: Order[];
  reviews?: Review[];
}

export interface Vendor {
  vendorId?: number;
  name: string;
  password: string;
  address: string;
  shopName: string;
  location_lat: number;
  location_lon: number;
  rating: number;
  items?: Item[];
  orders?: Order[];
  reviews?: Review[];
}

export interface Item {
  itemId?: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  vendor?: Vendor;
}

export interface Order {
  orderId?: number;
  customer?: Customer;
  vendor?: Vendor;
  orderTime: Date;
  deliveryTime: Date;
  status: string;
  totalPrice: number;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  orderItemId?: number;
  order?: Order;
  item?: Item;
  quantity: number;
  price: number;
}

export interface Review {
  reviewId?: number;
  customer?: Customer;
  vendor?: Vendor;
  reviewText: string;
  rating: number;
  reviewDate: Date;
}
