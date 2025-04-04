import Swal from 'sweetalert2';

export class SuccessMessages {

  // Login
  static loginSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Login realizado com sucesso!',
      toast: true,
      position: 'top-end',
      background: '#dff0d8',
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
  static saveUserSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Usuário cadastrado com sucesso!',
      toast: true,
      position: 'top-end',
      background: '#dff0d8',
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