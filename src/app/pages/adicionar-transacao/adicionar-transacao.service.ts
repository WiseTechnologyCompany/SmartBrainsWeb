import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface EditTransactionDTO {
  tipoMovimentacao: number;
  descricao: string;
  valor: number;
  dataCriacao: string,
  observacao: string,
  tipoCategoria: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdicionarTransacaoService {
  private readonly API_URL = `${environment.API_URL}`;

  constructor(private readonly httpClient: HttpClient) {}

  getEmail() {
    return sessionStorage.getItem('email') ?? '';
  }

  async findTransactionById(id: number): Promise<EditTransactionDTO> {
    return await firstValueFrom(this.httpClient.get<any>(`${this.API_URL}/movimentacao/edit/${id}`));
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

  async updateTransaction(id: number, body: any) {
    try {
      const response = await firstValueFrom(this.httpClient.patch<{ body: any }>(`${this.API_URL}/movimentacao/${id}`, body));
  
      if (response) {
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Transação atualizada com sucesso!',
          showConfirmButton: false,
          timer: 1750,
          width: '30%',
        });
      }

      return response;
    } catch (error) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao atualizar a transação',
        text: 'Tente novamente mais tarde.',
        showConfirmButton: true,
        width: '30%',
      });

      return null;
    }
  }  
}