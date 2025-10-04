export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
}

export interface User {
  id: number;
  username: string;
  password?: string; // Made optional for display purposes
  role: Role;
}

export interface SaleRecord {
  id: number;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  productName: string;
  productId: string;
  salesperson: string;
  region: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  image?: string; // Will store image URL from createObjectURL
}