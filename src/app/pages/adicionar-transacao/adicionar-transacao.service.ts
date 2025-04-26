import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdicionarTransacaoService {
  private readonly API_URL = `${environment.API_URL}`;

  constructor(private readonly httpClient: HttpClient) {}

  getEmail() {
    return sessionStorage.getItem('email') ?? '';
  }

  async getUserIdByEmail() {
    const email = this.getEmail();
    const headers = new HttpHeaders().set('Content-Type', 'application/json'); 
    const response = await firstValueFrom(this.httpClient.post<{ id: number }>(this.API_URL + '/usuarios/info', JSON.stringify({ email }), { headers }));

    if (response) {
      return response.id;
    }

    return null;
  }

  async saveNewTransaction(body: any) {
    const response = await firstValueFrom(this.httpClient.post<{ id: number }>(this.API_URL + '/movimentacao', body));

    if (response) {
      return Swal.fire({
        position: "center",
        icon: "success",
        title: "Transação salva com sucesso!",
        showConfirmButton: false,
        timer: 1750,
        width: '30%'
      });
    }

    return null;
  }
}
