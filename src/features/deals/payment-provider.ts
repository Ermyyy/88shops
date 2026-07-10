export type PaymentRequest = {
  dealId: string;
  amountKopecks: number;
  currency: "RUB";
  description: string;
};

export type PaymentStatus =
  | "CREATED"
  | "WAITING_FOR_WEBHOOK"
  | "PAID"
  | "REFUNDED"
  | "FAILED";

export type PayoutRequest = {
  dealId: string;
  sellerId: string;
  amountKopecks: number;
};

export interface PaymentProvider {
  createPayment(request: PaymentRequest): Promise<{ providerPaymentId: string }>;
  getPaymentStatus(providerPaymentId: string): Promise<PaymentStatus>;
  refundPayment(providerPaymentId: string): Promise<void>;
  createPayout(request: PayoutRequest): Promise<{ providerPayoutId: string }>;
}

// Реальная смена финансовых статусов должна происходить только на сервере
// после проверки webhook, подписи провайдера, прав доступа и rate limiting.
