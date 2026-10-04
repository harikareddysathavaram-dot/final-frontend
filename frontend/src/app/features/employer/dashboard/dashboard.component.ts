import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { PolicyService } from '../../../core/services/policy.service';
import { ClaimService } from '../../../core/services/claim.service';
import { PaymentService } from '../../../core/services/payment.service';
import { CompanyResponseDto } from '../../../core/models/company.models';
import { EmployeeResponseDto } from '../../../core/models/employee.models';
import { QuotationResponseDto, PolicyResponseDto } from '../../../core/models/policy.models';
import { ClaimResponseDto } from '../../../core/models/claim.models';
import { PaymentResponseDto } from '../../../core/models/payment.models';
import { LoginResponse } from '../../../core/models/auth.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private employeeService = inject(EmployeeService);
  private policyService = inject(PolicyService);
  private claimService = inject(ClaimService);
  private paymentService = inject(PaymentService);

  activeTab = 'overview';
  company: CompanyResponseDto | null = null;
  employees: EmployeeResponseDto[] = [];
  quotations: QuotationResponseDto[] = [];
  policies: PolicyResponseDto[] = [];
  claims: ClaimResponseDto[] = [];
  payments: PaymentResponseDto[] = [];

  isLoading = true;
  actionMessage = '';
  actionError = '';

  // Modal states
  showCompanyForm = false;
  showEmployeeForm = false;
  showQuotationForm = false;
  showClaimForm = false;
  showPaymentForm = false;
  showCoverageForm = false;

  selectedPolicyId = '';

  // Forms
  companyForm!: FormGroup;
  employeeForm!: FormGroup;
  quotationForm!: FormGroup;
  claimForm!: FormGroup;
  paymentForm!: FormGroup;
  coverageForm!: FormGroup;

  get user(): LoginResponse | null {
    return this.authService.currentUserValue;
  }

  get userName(): string {
    return this.user?.fullName || 'Employer';
  }

  ngOnInit() {
    this.initForms();
    this.loadCompany();
  }

  initForms() {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      taxId: ['', Validators.required],
      industry: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      nationalId: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(1)]],
      dateOfBirth: ['', Validators.required],
      dateOfJoining: ['', Validators.required]
    });

    this.quotationForm = this.fb.group({
      industryType: ['', Validators.required],
      totalEmployees: [0, [Validators.required, Validators.min(1)]],
      estimatedAnnualPayroll: [0, [Validators.required, Validators.min(1)]]
    });

    this.claimForm = this.fb.group({
      policyId: ['', Validators.required],
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      incidentDate: ['', Validators.required],
      injuryType: ['', Validators.required],
      description: ['', Validators.required],
      estimatedClaimAmount: [0, [Validators.required, Validators.min(1)]]
    });

    this.paymentForm = this.fb.group({
      referenceType: ['Premium', Validators.required],
      referenceId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentMethod: ['CreditCard', Validators.required],
      cardOrAccountLast4: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.coverageForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required]
    });
  }

  loadCompany() {
    this.isLoading = true;
    // Try to get the company by the current user's ID (decoded from token sub)
    // Using a simple approach: get the user ID from the JWT token
    const token = this.authService.token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub || payload.nameid;
        if (userId) {
          this.companyService.getCompanyByUserId(userId).subscribe({
            next: (company) => {
              this.company = company;
              this.loadCompanyData(company.id);
            },
            error: () => {
              this.isLoading = false;
              this.showCompanyForm = true;
            }
          });
          return;
        }
      } catch (e) {
        // fallthrough
      }
    }
    this.isLoading = false;
    this.showCompanyForm = true;
  }

  loadCompanyData(companyId: string) {
    forkJoin({
      employees: this.employeeService.getEmployees(companyId),
      quotations: this.policyService.getQuotationsByCompany(companyId),
      policies: this.policyService.getPoliciesByCompany(companyId),
      claims: this.claimService.getClaimsByCompany(companyId),
      payments: this.paymentService.getPaymentsByCompany(companyId)
    }).subscribe({
      next: (data) => {
        this.employees = data.employees;
        this.quotations = data.quotations;
        this.policies = data.policies;
        this.claims = data.claims;
        this.payments = data.payments;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.actionMessage = '';
    this.actionError = '';
  }

  clearMessages() {
    this.actionMessage = '';
    this.actionError = '';
  }

  // Company Registration
  registerCompany() {
    if (this.companyForm.invalid) return;
    const token = this.authService.token;
    let userId = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid || '';
      } catch (e) {}
    }

    const request = { ...this.companyForm.value, userId };
    this.companyService.registerCompany(request).subscribe({
      next: (company) => {
        this.company = company;
        this.showCompanyForm = false;
        this.actionMessage = 'Company registered successfully!';
        this.loadCompanyData(company.id);
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to register company.';
      }
    });
  }

  // Employee Management
  addEmployee() {
    if (this.employeeForm.invalid || !this.company) return;
    const request = { ...this.employeeForm.value, companyId: this.company.id };
    this.employeeService.createEmployee(request).subscribe({
      next: (emp) => {
        this.employees.push(emp);
        this.showEmployeeForm = false;
        this.employeeForm.reset();
        this.actionMessage = 'Employee added successfully!';
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to add employee.';
      }
    });
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
        this.actionMessage = 'Employee removed.';
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to delete employee.';
      }
    });
  }

  // Quotation
  requestQuotation() {
    if (this.quotationForm.invalid || !this.company) return;
    const request = { ...this.quotationForm.value, companyId: this.company.id };
    this.policyService.requestQuotation(request).subscribe({
      next: (quot) => {
        this.quotations.push(quot);
        this.showQuotationForm = false;
        this.quotationForm.reset();
        this.actionMessage = `Quotation received! Premium: $${quot.calculatedPremium}`;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to request quotation.';
      }
    });
  }

  acceptQuotation(quotationId: string) {
    this.policyService.acceptQuotation({ quotationId }).subscribe({
      next: (policy) => {
        this.policies.push(policy);
        const q = this.quotations.find(q => q.id === quotationId);
        if (q) q.status = 'Accepted';
        this.actionMessage = `Policy ${policy.policyNumber} created!`;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to accept quotation.';
      }
    });
  }

  // Claims
  onEmployeeSelected() {
    const empId = this.claimForm.get('employeeId')?.value;
    const emp = this.employees.find(e => e.id === empId);
    if (emp) {
      this.claimForm.patchValue({ employeeName: `${emp.firstName} ${emp.lastName}` });
    }
  }

  submitClaim() {
    if (this.claimForm.invalid || !this.company) return;
    const request = { ...this.claimForm.value, companyId: this.company.id };
    this.claimService.submitClaim(request).subscribe({
      next: (claim) => {
        this.claims.push(claim);
        this.showClaimForm = false;
        this.claimForm.reset();
        this.actionMessage = `Claim ${claim.claimNumber} submitted successfully!`;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to submit claim.';
      }
    });
  }

  // Payments
  makePayment() {
    if (this.paymentForm.invalid || !this.company) return;
    const request = { ...this.paymentForm.value, companyId: this.company.id };
    this.paymentService.processPayment(request).subscribe({
      next: (payment) => {
        this.payments.push(payment);
        this.showPaymentForm = false;
        this.paymentForm.reset();
        this.actionMessage = `Payment processed! Receipt: ${payment.receiptNumber}`;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to process payment.';
      }
    });
  }

  // Coverage
  openCoverageForm(policyId: string) {
    this.selectedPolicyId = policyId;
    this.showCoverageForm = true;
  }

  onCoverageEmployeeSelected() {
    const empId = this.coverageForm.get('employeeId')?.value;
    const emp = this.employees.find(e => e.id === empId);
    if (emp) {
      this.coverageForm.patchValue({ employeeName: `${emp.firstName} ${emp.lastName}` });
    }
  }

  addCoverage() {
    if (this.coverageForm.invalid || !this.selectedPolicyId) return;
    this.policyService.addEmployeeCoverage(this.selectedPolicyId, this.coverageForm.value).subscribe({
      next: (policy) => {
        const idx = this.policies.findIndex(p => p.id === this.selectedPolicyId);
        if (idx >= 0) this.policies[idx] = policy;
        this.showCoverageForm = false;
        this.coverageForm.reset();
        this.actionMessage = 'Employee coverage added!';
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to add coverage.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': case 'approved': case 'completed': case 'paid': case 'accepted':
        return 'badge-success';
      case 'pending': case 'submitted': case 'underreview': case 'processing': case 'quoted':
        return 'badge-warning';
      case 'rejected': case 'denied': case 'inactive': case 'expired':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
