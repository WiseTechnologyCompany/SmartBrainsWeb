export class GlobalFormats {
  static formatarData(data: string): string {
    return data.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
  }

  static formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  static formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
}