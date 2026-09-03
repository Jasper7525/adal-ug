export type ProductCategory = 'all' | 'cylinders' | '3kg' | '6kg' | '12.5kg' | '38kg' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: '3kg' | '6kg' | '12.5kg' | '38kg' | 'accessories';
  sizeKg?: number;
  description: string;
  bestFor: string;
  burnDuration: string;
  refillPriceUGX: number;
  completePriceUGX: number;
  currentType: 'refill' | 'complete';
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  image: string;
  features: string[];
  specs: {
    valveType: string;
    tareWeight?: string;
    totalWeight?: string;
    certification: string;
  };
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'accessories';
  description: string;
  priceUGX: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  features: string[];
  compatibility: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  type: 'refill' | 'complete' | 'accessory';
  size?: string;
  unitPriceUGX: number;
  quantity: number;
  image: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  estTime: string;
  deliveryFeeUGX: number;
  popularLandmarks: string;
}

export interface CustomerOrderForm {
  fullName: string;
  phoneNumber: string;
  altPhoneNumber?: string;
  deliveryZone: string;
  streetAddress: string;
  specialInstructions: string;
  paymentMethod: 'cash_on_delivery' | 'mobile_money' | 'airtel_money';
  deliverySpeed: 'express' | 'standard' | 'scheduled';
  requestSafetyCheck: boolean;
}
