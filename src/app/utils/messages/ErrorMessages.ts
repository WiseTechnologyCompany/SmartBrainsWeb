import Swal from 'sweetalert2';

export class ErrorMessages {
    
  // Login
  static loginErrorMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Credenciais Inválidas!',
      text: 'Verifique seu e-mail ou senha e tente novamente.',
      toast: true,
      position: 'top-end',
      background: '#f8d7da',
      color: '#000000',
      width: '30%',
      showConfirmButton: false,
      timer: 4750,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }

  // Cadastro
  static saveUserErrorMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Oops! Senhas diferentes!',
      text: 'As senhas estão diferentes. Por favor, verifique os dois campos e tente novamente.',
      toast: true,
      position: 'top-end',
      background: '#f8d7da',
      color: '#000000',
      width: '30%',
      showConfirmButton: false,
      timer: 4750,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }
}
