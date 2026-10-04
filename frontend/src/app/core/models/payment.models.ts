export interface ProcessPaymentRequestDto {
  referenceType: string;
  referenceId: string;
  companyId: string;
  amount: number;
  paymentMethod: string;
  cardOrAccountLast4: string;
}

export interface PaymentResponseDto {
  id: string;
  transactionReference: string;
  referenceType: string;
  referenceId: string;
  companyId: string;
  amount: number;
  paymentMethod: string;
  cardOrAccountLast4: string;
  status: string;
  receiptNumber: string;
  createdAt: string;
  processedAt: string;
}
