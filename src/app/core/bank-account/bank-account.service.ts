import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from './bank-account.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  constructor(private http: HttpClient) {}

  getBankAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>('/api/bank_accounts');
  }
}
