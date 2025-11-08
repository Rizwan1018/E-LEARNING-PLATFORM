import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-history',
  standalone:false,
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  payments: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || !user.id) {
      alert('Please login to view payment history.');
      return;
    }

    this.paymentService.getPaymentsByStudent(user.id).subscribe({
      next: (res) => (this.payments = res),
      error: (err) => console.error(err)
    });
  }
}
