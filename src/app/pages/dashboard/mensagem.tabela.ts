import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MensagemTabela extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por Página:';
}