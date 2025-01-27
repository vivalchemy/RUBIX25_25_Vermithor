type Product = {
  description: string;
  itemId: string;
  imgLink: string;
  name: string;
  peopleRequired: number;
  price: number;
  rating: number;
  serves: number;
  timeToArrive: string;
  vendor: string
};

type Products = Product[];

export type { Product, Products };
