import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { AuthService } from '../../../services/auth.service';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../../models/invoice.model';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-invoice-create',
  standalone: false,
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent implements OnInit {
  invoiceForm: FormGroup;
  isLoading = false;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      issueDate: [new Date().toISOString().split('T')[0], Validators.required],
      dueDate: ['', Validators.required],
      taxRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateItemTotal(item: FormGroup): number {
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  getSubtotal(): number {
    return this.items.controls.reduce((total, item) => {
      return total + this.calculateItemTotal(item as FormGroup);
    }, 0);
  }

  getTaxAmount(): number {
    const subtotal = this.getSubtotal();
    const taxRate = this.invoiceForm.get('taxRate')?.value || 0;
    return subtotal * (taxRate / 100);
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTaxAmount();
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.isLoading = true;
      this.loadingService.showLoader();

      const formValue = this.invoiceForm.value;
      const invoice: Partial<Invoice> = {
        clientId: this.currentUser?.id,
        clientName: formValue.clientName,
        clientEmail: formValue.clientEmail,
        issueDate: new Date(formValue.issueDate),
        dueDate: new Date(formValue.dueDate),
        items: formValue.items.map((item: any) => ({
          ...item,
          total: this.calculateItemTotal(this.fb.group(item))
        })),
        subtotal: this.getSubtotal(),
        taxRate: formValue.taxRate,
        taxAmount: this.getTaxAmount(),
        totalAmount: this.getTotal(),
        notes: formValue.notes,
        status: InvoiceStatus.DRAFT
      };

      this.invoiceService.createInvoice(invoice).subscribe({
        next: (createdInvoice) => {
          this.isLoading = false;
          this.loadingService.hideLoader();
          this.router.navigate(['/fintech/invoices']);
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          this.isLoading = false;
          this.loadingService.hideLoader();
        }
      });
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fintech']);
  }
}
