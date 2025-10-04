
import { User, Role, SaleRecord } from './types';

const starkCustomerId = 'CISTARK001';
const wayneCustomerId = 'CIWAYNE001';

export const INITIAL_USERS: User[] = [
  { id: 1, username: 'admin', password: 'password', role: Role.Admin },
  { id: 2, username: 'STARKINDUSTRIES', password: starkCustomerId, role: Role.Customer },
  { id: 3, username: 'WAYNEENTERPRISES', password: wayneCustomerId, role: Role.Customer },
];

export const INITIAL_SALES_RECORDS: SaleRecord[] = [
  {
    id: 1,
    date: '2023-10-26',
    time: '14:30',
    customerId: starkCustomerId,
    customerName: 'Stark Industries',
    productName: 'Arc Reactor Core',
    productId: 'P001',
    salesperson: 'Tony Stark',
    region: 'North America',
    quantity: 10,
    unitPrice: 50000,
    discount: 0.1,
    totalAmount: 450000,
  },
  {
    id: 2,
    date: '2023-10-27',
    time: '09:15',
    customerId: wayneCustomerId,
    customerName: 'Wayne Enterprises',
    productName: 'Grappling Hook',
    productId: 'P002',
    salesperson: 'Lucius Fox',
    region: 'North America',
    quantity: 100,
    unitPrice: 1500,
    discount: 0.05,
    totalAmount: 142500,
  },
  {
    id: 3,
    date: '2023-10-27',
    time: '13:45',
    customerId: starkCustomerId,
    customerName: 'Stark Industries',
    productName: 'Repulsor Gauntlet',
    productId: 'P003',
    salesperson: 'Pepper Potts',
    region: 'EMEA',
    quantity: 2,
    unitPrice: 120000,
    discount: 0,
    totalAmount: 240000,
  },
];

export const DUMMY_VISIBLE_FIELDS: Record<string, boolean> = {
    date: true,
    time: true,
    customerId: true,
    customerName: true,
    productName: true,
    productId: true,
    salesperson: true,
    region: false,
    quantity: true,
    unitPrice: true,
    discount: false,
    totalAmount: true,
    image: true,
};
