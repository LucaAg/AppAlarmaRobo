import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from './loginService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = new FormControl('', [Validators.required,Validators.email]);
  clave = new FormControl('', [Validators.required,Validators.minLength(6)]);

  emailBind = "";
  claveBind = "";
  constructor(private loginService:LoginService) {}
  ngOnInit() {}

  getLogin()
  {
    const email = this.email.value?.toString();
    const clave = this.clave.value?.toString();

    this.loginService.login(email,clave);
  }
  obtenerUsuario(email:string,contraseña:string)
  {
    this.emailBind = email;
    this.claveBind = contraseña;
  }

  insertarAccesosRapidos(event:Event | any)
  {
    const opcionSeleccionada = event.target.value;

    switch(opcionSeleccionada)
    {
      case 'admin':
        this.emailBind = "admin@admin.com";
        this.claveBind = "1111111";
        break;
      case 'invitado':
        this.emailBind = "invitado@invitado.com";
        this.claveBind = "2222222";
        break;
      case 'usuario':
        this.emailBind = "usuario@usuario.com";
        this.claveBind = "3333333";
        break;
      default:
        this.emailBind = "";
        this.claveBind = "";
        break;
    }
  }

}
