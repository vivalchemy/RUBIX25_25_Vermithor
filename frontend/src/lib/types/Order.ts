export type Order = {
  id: string;
  productIds: string[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  timeToArrive: string;
  orderDate: string;
};

export type Orders = Order[];
