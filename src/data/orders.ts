export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  dimensions: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'whatsapp' | 'cod' | 'upi';
  items: OrderItem[];
  totalAmount: number;
  totalSavings: number;
  status: OrderStatus;
  notes?: string;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: "CN-783921",
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    customerName: "Pooja Sharma",
    customerPhone: "9818234567",
    customerAddress: "Apartment 402, DLF Phase 4, Gurgaon, Haryana 122002",
    paymentMethod: "whatsapp",
    status: "pending",
    totalAmount: 3798,
    totalSavings: 1198,
    items: [
      {
        productId: "gulabi-bagh-rose",
        productName: "Gulabi Bagh English Rose",
        productImage: "/src/assets/images/exact_sheet1_pink_rose_1790997736396.jpg",
        dimensions: "108 x 108 inches",
        price: 1899,
        quantity: 1
      },
      {
        productId: "rosemary-blue-rose-100x108",
        productName: "Rosemary Royal Blue Rose",
        productImage: "/src/assets/images/exact_sheet9_rosemary_blue_rose_1791027541188.jpg",
        dimensions: "100 x 108 inches",
        price: 1899,
        quantity: 1
      }
    ],
    notes: "Customer requested evening delivery after 6 PM."
  },
  {
    id: "CN-652190",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customerName: "Vikram Malhotra",
    customerPhone: "9871109823",
    customerAddress: "Villa 14, Nirvana Country, Sector 50, Gurgaon, Haryana 122018",
    paymentMethod: "whatsapp",
    status: "confirmed",
    totalAmount: 2199,
    totalSavings: 700,
    items: [
      {
        productId: "shivaura-trellis-slate",
        productName: "Shivaura Trellis & Slate Rose",
        productImage: "/src/assets/images/exact_sheet5_shivaura_trellis_1790997781634.jpg",
        dimensions: "108 x 108 inches",
        price: 2199,
        quantity: 1
      }
    ],
    notes: "Direct WhatsApp order confirmation."
  },
  {
    id: "CN-510482",
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    customerName: "Ananya Deshmukh",
    customerPhone: "9920145892",
    customerAddress: "Tower B-1104, Central Park Resorts, Sohna Road, Gurgaon 122001",
    paymentMethod: "whatsapp",
    status: "dispatched",
    totalAmount: 1999,
    totalSavings: 800,
    items: [
      {
        productId: "peacock-teal-paisley",
        productName: "Heritage Peacock Paisley Daaman",
        productImage: "/src/assets/images/exact_sheet8_peacock_teal_1790997812944.jpg",
        dimensions: "108 x 108 inches",
        price: 1999,
        quantity: 1
      }
    ],
    notes: "Out for delivery with Gurgaon express courier."
  }
];
