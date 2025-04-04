export interface Transaction {
  isLoading: boolean;
  type: 'payment' | 'payout';
}

export interface SnapRequest {
  transaction_details: TransactionDetails;
  item_details?: ItemDetails;
  customer_details?: CustomerDetails;
  metadata?: any;
}

export interface SnapResponse {
  // status_code: '201';
  // status_message: 'Success, transaction is found';
  // transaction_id: 'e4498d82-e88a-4111-9f76-e6fadcc5d52e';
  // order_id: 'ORDER-1743676291859';
  // gross_amount: '123500.00';
  // payment_type: 'qris';
  // transaction_time: '2025-04-03 17:31:39';
  // transaction_status: 'pending';
  // fraud_status: 'accept';
  // finish_redirect_url: 'http://example.com?order_id=ORDER-1743676291859&status_code=201&transaction_status=pending';

  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  finish_redirect_url: string;
}

interface TransactionDetails {
  order_id: string;
  gross_amount: number;
}

interface ItemDetails {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  category?: string;
  merchant_name?: string;
}

interface CustomerAddress {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country_code?: string;
}

interface CustomerDetails {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  billing_address?: CustomerAddress;
  customer_address?: CustomerAddress;
}
