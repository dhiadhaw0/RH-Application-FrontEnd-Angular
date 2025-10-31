import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TaxService } from '../../../services/tax.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { TaxRecord, TaxDeduction, TaxType, TaxStatus } from '../../../models/tax-record.model';

@Component({
  selector: 'app-tax-tracker',
  standalone: false,
  templateUrl: './tax-tracker.component.html',
  styleUrl: './tax-tracker.component.scss'
})
export class TaxTrackerComponent implements OnInit {
  taxRecords: TaxRecord[] = [];
  selectedRecord: TaxRecord | null = null;
  isLoading = false;
  currentUser: any;
  selectedYear: number = new Date().getFullYear();
  taxForm: FormGroup;
  deductionForm: FormGroup;

  taxTypes = [
    { value: TaxType.INCOME, label: 'Income Tax' },
    { value: TaxType.SALES, label: 'Sales Tax' },
    { value: TaxType.VAT, label: 'VAT' },
    { value: TaxType.CORPORATE, label: 'Corporate Tax' },
    { value: TaxType.SELF_EMPLOYMENT, label: 'Self-Employment Tax' }
  ];

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.taxForm = this.fb.group({
      taxYear: [this.selectedYear, Validators.required],
      taxType: [TaxType.INCOME, Validators.required],
      grossIncome: [0, [Validators.required, Validators.min(0)]],
      taxableIncome: [0, [Validators.required, Validators.min(0)]],
      taxOwed: [0, [Validators.required, Validators.min(0)]],
      taxPaid: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    this.deductionForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTaxRecords();
  }

  loadTaxRecords(): void {
    this.isLoading = true;
    this.loadingService.showLoader();

    // Use static data for demonstration
    this.taxRecords = this.getStaticTaxRecords();
    this.isLoading = false;
    this.loadingService.hideLoader();

    // Uncomment below for API integration
    /*
    this.taxService.getTaxRecordsByUser(this.currentUser?.id).subscribe({
      next: (records) => {
        this.taxRecords = records;
        this.isLoading = false;
        this.loadingService.hideLoader();
      },
      error: (error) => {
        console.error('Error loading tax records:', error);
        this.isLoading = false;
        this.loadingService.hideLoader();
      }
    });
    */
  }

  private getStaticTaxRecords(): TaxRecord[] {
    return [
      {
        id: 1,
        userId: 1,
        taxYear: 2023,
        taxType: TaxType.SELF_EMPLOYMENT,
        grossIncome: 85000,
        taxableIncome: 72000,
        taxOwed: 12240,
        taxPaid: 12240,
        taxDueDate: new Date('2024-04-15'),
        status: TaxStatus.PAID,
        deductions: [
          { id: 1, description: 'Home Office Deduction', amount: 5000, category: 'Office', date: new Date('2023-12-31') },
          { id: 2, description: 'Business Travel', amount: 3200, category: 'Travel', date: new Date('2023-11-15') },
          { id: 3, description: 'Equipment Purchase', amount: 2800, category: 'Equipment', date: new Date('2023-08-20') }
        ],
        notes: 'Self-employment tax for freelance web development',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 2,
        userId: 1,
        taxYear: 2024,
        taxType: TaxType.INCOME,
        grossIncome: 95000,
        taxableIncome: 78000,
        taxOwed: 14040,
        taxPaid: 8000,
        taxDueDate: new Date('2025-04-15'),
        status: TaxStatus.PENDING,
        deductions: [
          { id: 4, description: 'Health Insurance Premiums', amount: 4800, category: 'Health', date: new Date('2024-06-01') },
          { id: 5, description: 'Professional Development', amount: 2200, category: 'Education', date: new Date('2024-03-15') },
          { id: 6, description: 'Software Subscriptions', amount: 1800, category: 'Software', date: new Date('2024-07-01') },
          { id: 7, description: 'Business Meals', amount: 1200, category: 'Meals', date: new Date('2024-09-10') }
        ],
        notes: 'Income tax with self-employment deductions',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-10-01')
      },
      {
        id: 3,
        userId: 1,
        taxYear: 2022,
        taxType: TaxType.SELF_EMPLOYMENT,
        grossIncome: 65000,
        taxableIncome: 58000,
        taxOwed: 9860,
        taxPaid: 9860,
        taxDueDate: new Date('2023-04-15'),
        status: TaxStatus.FILED,
        deductions: [
          { id: 8, description: 'Internet and Phone', amount: 2400, category: 'Utilities', date: new Date('2022-12-31') },
          { id: 9, description: 'Marketing Expenses', amount: 1800, category: 'Marketing', date: new Date('2022-05-15') }
        ],
        notes: 'Previous year self-employment tax',
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2023-04-10')
      }
    ];
  }

  getRecordsForYear(year: number): TaxRecord[] {
    return this.taxRecords.filter(record => record.taxYear === year);
  }

  selectRecord(record: TaxRecord): void {
    this.selectedRecord = record;
    this.deductionForm.reset({
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  }

  createTaxRecord(): void {
    if (this.taxForm.valid) {
      this.isLoading = true;
      this.loadingService.showLoader();

      const formValue = this.taxForm.value;
      const taxRecord: Partial<TaxRecord> = {
        userId: this.currentUser?.id,
        taxYear: formValue.taxYear,
        taxType: formValue.taxType,
        grossIncome: formValue.grossIncome,
        taxableIncome: formValue.taxableIncome,
        taxOwed: formValue.taxOwed,
        taxPaid: formValue.taxPaid,
        taxDueDate: new Date(formValue.taxYear + 1, 3, 15), // April 15th of next year
        status: TaxStatus.PENDING,
        deductions: [],
        notes: formValue.notes
      };

      this.taxService.createTaxRecord(taxRecord).subscribe({
        next: (createdRecord) => {
          this.taxRecords.push(createdRecord);
          this.taxForm.reset({
            taxYear: this.selectedYear,
            taxType: TaxType.INCOME,
            grossIncome: 0,
            taxableIncome: 0,
            taxOwed: 0,
            taxPaid: 0,
            notes: ''
          });
          this.isLoading = false;
          this.loadingService.hideLoader();
        },
        error: (error) => {
          console.error('Error creating tax record:', error);
          this.isLoading = false;
          this.loadingService.hideLoader();
        }
      });
    }
  }

  addDeduction(): void {
    if (this.deductionForm.valid && this.selectedRecord) {
      const deduction: Partial<TaxDeduction> = {
        description: this.deductionForm.value.description,
        amount: this.deductionForm.value.amount,
        category: this.deductionForm.value.category,
        date: new Date(this.deductionForm.value.date)
      };

      this.taxService.addDeduction(this.selectedRecord.id, deduction).subscribe({
        next: (addedDeduction) => {
          if (this.selectedRecord) {
            this.selectedRecord.deductions.push(addedDeduction);
            this.selectedRecord.taxableIncome = Math.max(0, this.selectedRecord.grossIncome - this.getTotalDeductions(this.selectedRecord));
            this.calculateTax(this.selectedRecord);
          }
          this.deductionForm.reset({
            description: '',
            amount: 0,
            category: '',
            date: new Date().toISOString().split('T')[0]
          });
        },
        error: (error) => {
          console.error('Error adding deduction:', error);
        }
      });
    }
  }

  removeDeduction(recordId: number, deductionId: number): void {
    this.taxService.removeDeduction(recordId, deductionId).subscribe({
      next: () => {
        if (this.selectedRecord) {
          this.selectedRecord.deductions = this.selectedRecord.deductions.filter(d => d.id !== deductionId);
          this.selectedRecord.taxableIncome = Math.max(0, this.selectedRecord.grossIncome - this.getTotalDeductions(this.selectedRecord));
          this.calculateTax(this.selectedRecord);
        }
      },
      error: (error) => {
        console.error('Error removing deduction:', error);
      }
    });
  }

  calculateTax(record: TaxRecord): void {
    this.taxService.calculateTax(record.taxableIncome, record.taxType, 0).subscribe({
      next: (result) => {
        record.taxOwed = result.taxOwed;
      },
      error: (error) => {
        console.error('Error calculating tax:', error);
      }
    });
  }

  getTotalDeductions(record: TaxRecord): number {
    return record.deductions.reduce((total, deduction) => total + deduction.amount, 0);
  }

  getStatusBadgeClass(status: TaxStatus): string {
    switch (status) {
      case TaxStatus.PENDING:
        return 'badge-pending';
      case TaxStatus.FILED:
        return 'badge-filed';
      case TaxStatus.PAID:
        return 'badge-paid';
      case TaxStatus.OVERDUE:
        return 'badge-overdue';
      default:
        return 'badge-default';
    }
  }

  getStatusLabel(status: TaxStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  getTypeLabel(type: TaxType): string {
    const typeObj = this.taxTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  onYearChange(): void {
    this.selectedRecord = null;
  }

  getTotalTaxOwed(): string {
    const total = this.taxRecords.reduce((sum, r) => sum + r.taxOwed, 0);
    return this.formatCurrency(total);
  }

  getTotalTaxPaid(): string {
    const total = this.taxRecords.reduce((sum, r) => sum + r.taxPaid, 0);
    return this.formatCurrency(total);
  }
}
