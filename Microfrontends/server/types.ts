export interface Product {
  id: string;
  name: string;
  driver: string;
  team: string;
  category: "Car" | "Merchandise" | "Collectibles" | "Racing Gear";
  price: number;
  picture: string;
  description: string;
  inStock: boolean;
  featured: boolean;
}

export interface CreateProductRequest {
  name: string;
  driver: string;
  team: string;
  category: "Car" | "Merchandise" | "Collectibles" | "Racing Gear";
  price: number;
  picture: string;
  description: string;
  inStock?: boolean;
  featured?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
