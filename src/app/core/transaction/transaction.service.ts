import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionCreate } from './transaction.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transactions');
  }

  createTransaction(data: TransactionCreate): Observable<Transaction> {
    return this.http.post<Transaction>('/api/transactions', data);
  }
}
