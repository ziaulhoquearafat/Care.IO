export type Role = "user" | "admin";
export type ServiceCategory =
  | "Baby Care"
  | "Elderly Service"
  | "Sick People Service";
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type DurationType = "days" | "hours";
export type PaymentStatus = "Paid" | "Failed";

// 1. User Interface (Registration & Login)
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  nid: string;
  password?: string;
  role: Role;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 2. Service Interface (Service Detail Page)
export interface IService {
  _id?: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 3. Location Interface (Booking Requirement)
export interface ILocation {
  division: string;
  district: string;
  city: string;
  area: string;
}

// 4. Booking Interface (My Bookings & Admin Dashboard)
export interface IBooking {
  _id?: string;
  userId: string | IUser;
  serviceId: string | IService;
  duration: number;
  durationType: DurationType;
  location: ILocation;
  totalCost: number;
  status: BookingStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 5. Payment Interface (Stripe Payment System & Admin Dashboard)
export interface IPayment {
  _id?: string;
  bookingId: string | IBooking;
  userId: string | IUser;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 6. Generic API Response Interface (For consistent backend responses)
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
}
