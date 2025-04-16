import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/Environment';

@Injectable({
  providedIn: 'root',
})
export class CriarContaService {
  private readonly URL = `${environment.API_URL}`;

  constructor(private httpClient: HttpClient) {}

  async checkEmail(email: string): Promise<boolean> {
    const response = await firstValueFrom(this.httpClient.post<{ emailAlreadyExists: boolean }>(`${this.URL}/auth/check/email`, { email } ));

    return response.emailAlreadyExists;
  }

  async saveUser(body: any): Promise<void> {
    await firstValueFrom(this.httpClient.post(`${this.URL}/usuarios`, body));
  }

  async saveLogin(body: any): Promise<void> {
    await firstValueFrom(this.httpClient.post(`${this.URL}/auth/save`, body));
  }

  async getToken(body: any): Promise<string> {
    const response = await firstValueFrom(this.httpClient.post<{ access_token: string }>(`${this.URL}/auth`, body));

    return response.access_token;
  }
}
