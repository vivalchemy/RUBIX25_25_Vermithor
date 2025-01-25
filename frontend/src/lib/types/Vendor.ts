export type Vendor = {
    name: string;
    email: string;
    address: string;
    shopName: string;
    location_lat: number;
    location_lon: number;
    rating: number; // Default value in Java is 0.0, so it is non-nullable
    password: string;
};