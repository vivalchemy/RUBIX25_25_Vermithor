import { ProductsType } from ".";

type Offer = {
  id: number;
  title: string;
  description: string;
  image: string;
  products: ProductsType;
}

type Offers = Offer[];

export type { Offer, Offers };
