export interface Product {
  id: string;
  name: string;
  price: number;
  storeId: string;
  description?: string;
  quantity?: number;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  phone?: string;
  products?: Product[];
}

export interface StoreFormData {
  name: string;
  location: string;
  phone?: string;
}

export interface ProductFormData {
  name: string;
  price?: number;
  description?: string;
  quantity?: number;
}
