import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProcessPaymentRequestDto, PaymentResponseDto } from '../models/payment.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/payments`;

  processPayment(request: ProcessPaymentRequestDto): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(`${this.baseUrl}/process`, request);
  }

  getPaymentById(id: string): Observable<PaymentResponseDto> {
    return this.http.get<PaymentResponseDto>(`${this.baseUrl}/${id}`);
  }

  getPaymentsByCompany(companyId: string): Observable<PaymentResponseDto[]> {
    return this.http.get<PaymentResponseDto[]>(`${this.baseUrl}/company/${companyId}`);
  }

  getPaymentsByReference(referenceId: string): Observable<PaymentResponseDto[]> {
    return this.http.get<PaymentResponseDto[]>(`${this.baseUrl}/reference/${referenceId}`);
  }

  getAllPayments(): Observable<PaymentResponseDto[]> {
    return this.http.get<PaymentResponseDto[]>(this.baseUrl);
  }
}
