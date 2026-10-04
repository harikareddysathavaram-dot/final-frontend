import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { PolicyService } from '../../../core/services/policy.service';
import { ClaimService } from '../../../core/services/claim.service';
import { PaymentService } from '../../../core/services/payment.service';
import { UserResponseDto } from '../../../core/models/auth.models';
import { CompanyResponseDto, UpdateCompanyStatusRequest } from '../../../core/models/company.models';
import { PolicyResponseDto } from '../../../core/models/policy.models';
import { ClaimResponseDto } from '../../../core/models/claim.models';
import { PaymentResponseDto } from '../../../core/models/payment.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private policyService = inject(PolicyService);
  private claimService = inject(ClaimService);
  private paymentService = inject(PaymentService);

  activeTab = 'overview';
  pendingUsers: UserResponseDto[] = [];
  companies: CompanyResponseDto[] = [];
  policies: PolicyResponseDto[] = [];
  claims: ClaimResponseDto[] = [];
  payments: PaymentResponseDto[] = [];

  isLoading = true;
  actionMessage = '';
  actionError = '';

  get userName(): string {
    return this.authService.currentUserValue?.fullName || 'Admin';
  }

  // Stats
  get totalCompanies() { return this.companies.length; }
  get activeCompanies() { return this.companies.filter(c => c.isActive).length; }
  get totalPolicies() { return this.policies.length; }
  get activePolicies() { return this.policies.filter(p => p.status === 'Active').length; }
  get totalClaims() { return this.claims.length; }
  get pendingClaims() { return this.claims.filter(c => c.status === 'Submitted' || c.status === 'UnderReview').length; }
  get totalPayments() { return this.payments.length; }
  get totalRevenue() { return this.payments.reduce((sum, p) => sum + p.amount, 0); }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;

    this.authService.getPendingUsers().subscribe({
      next: (users) => this.pendingUsers = users,
      error: () => {}
    });

    this.companyService.getAllCompanies().subscribe({
      next: (companies) => this.companies = companies,
      error: () => {}
    });

    this.policyService.getAllPolicies().subscribe({
      next: (policies) => this.policies = policies,
      error: () => {}
    });

    this.claimService.getAllClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    this.paymentService.getAllPayments().subscribe({
      next: (payments) => this.payments = payments,
      error: () => {}
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.actionMessage = '';
    this.actionError = '';
  }

  approveUser(userId: string) {
    this.authService.approveUser(userId).subscribe({
      next: () => {
        this.actionMessage = 'User approved successfully!';
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to approve user.';
      }
    });
  }

  updateCompanyStatus(companyId: string, status: string) {
    const request: UpdateCompanyStatusRequest = { status };
    this.companyService.updateCompanyStatus(companyId, request).subscribe({
      next: (updated) => {
        this.actionMessage = `Company status updated to ${status}`;
        const idx = this.companies.findIndex(c => c.id === companyId);
        if (idx >= 0) this.companies[idx] = updated;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to update company status.';
      }
    });
  }

  activatePolicy(policyId: string) {
    this.policyService.activatePolicy(policyId).subscribe({
      next: () => {
        this.actionMessage = 'Policy activated!';
        const p = this.policies.find(p => p.id === policyId);
        if (p) p.status = 'Active';
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to activate policy.';
      }
    });
  }

  updateClaimStatus(claimId: string, status: string) {
    this.claimService.updateClaimStatus(claimId, status).subscribe({
      next: () => {
        this.actionMessage = `Claim status updated to ${status}`;
        const c = this.claims.find(c => c.id === claimId);
        if (c) c.status = status;
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to update claim status.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'paid':
        return 'badge-success';
      case 'pending':
      case 'submitted':
      case 'underreview':
      case 'processing':
        return 'badge-warning';
      case 'rejected':
      case 'denied':
      case 'inactive':
      case 'expired':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
