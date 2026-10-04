import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateEmployeeRequest, EmployeeResponseDto, UpdateEmployeeRequest } from '../models/employee.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/employees`;

  createEmployee(request: CreateEmployeeRequest): Observable<EmployeeResponseDto> {
    return this.http.post<EmployeeResponseDto>(this.baseUrl, request);
  }

  getEmployees(companyId?: string): Observable<EmployeeResponseDto[]> {
    const url = companyId ? `${this.baseUrl}?companyId=${companyId}` : this.baseUrl;
    return this.http.get<EmployeeResponseDto[]>(url);
  }

  getEmployeeById(id: string): Observable<EmployeeResponseDto> {
    return this.http.get<EmployeeResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: string, request: UpdateEmployeeRequest): Observable<EmployeeResponseDto> {
    return this.http.put<EmployeeResponseDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
