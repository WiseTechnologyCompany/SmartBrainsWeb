import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class GlobalValidators {

  static dataNascimentoValidator(control: FormControl): ValidationErrors | null {
    const dataNascimento = control.value;

    if (!dataNascimento) return null; 

    const dia = dataNascimento.substring(0, 2);  
    const mes = dataNascimento.substring(2, 4);   
    const ano = dataNascimento.substring(4, 8);  
    const anoAtual = new Date().getFullYear() - 10;

    if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano <= anoAtual) {
       return null;
    }

    return { invalidDate: true };
  }

  static emailValidator(control: FormControl): ValidationErrors | null {
    const email = control.value?.toLowerCase() ?? '';
  
    const contemArroba = email.includes('@');
    const terminaCorretamente = email.endsWith('.com') || email.endsWith('.br');
    const contemTeste = email.includes('teste');
  
    if (!contemArroba || !terminaCorretamente || contemTeste) {
      return { invalidEmail: true };
    }
  
    return null;
  }

  static senhaForteValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.value;

    if (!senha) return null;

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

    const valido = regex.test(senha);

    return valido ? null : { senhaFraca: true };
  }

  static CPFValidator(control: FormControl): ValidationErrors | null {
    const cpf = control.value;

    if (!cpf) return null;

    const cpfSemMascara = GlobalValidators.removerMascara(cpf);
  
    if (!GlobalValidators.temTamanhoValido(cpfSemMascara) || GlobalValidators.todosDigitosIguais(cpfSemMascara)) {
      return { invalidCPF: true };
    }
  
    if (!GlobalValidators.digitosVerificadoresValidos(cpfSemMascara)) {
      return { invalidCPF: true };
    }
  
    return null;
  }
  
  static removerMascara(cpf: string): string {
    return cpf?.replace(/\D/g, '') || '';
  }
  
  private static temTamanhoValido(cpf: string): boolean {
    return cpf.length === 11;
  }
  
  private static todosDigitosIguais(cpf: string): boolean {
    return /^(\d)\1+$/.test(cpf);
  }
  
  private static calcularDigito(cpf: string, fator: number): number {
    let soma = 0;
    for (let i = 0; i < fator - 1; i++) {
      soma += Number(cpf[i]) * (fator - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }
  
  private static digitosVerificadoresValidos(cpf: string): boolean {
    const primeiro = GlobalValidators.calcularDigito(cpf, 10);
    const segundo = GlobalValidators.calcularDigito(cpf, 11);
    return primeiro === Number(cpf[9]) && segundo === Number(cpf[10]);
  }  
}