import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/loginService';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { ToastService } from '../servicios/toast.service';
@Component({
  selector: 'app-alarma',
  templateUrl: './alarma.page.html',
  styleUrls: ['./alarma.page.scss'],
})
export class AlarmaPage implements OnInit {

  constructor(private herramientasLogin:LoginService,
    private vibration: Vibration,
    private deviceMotion:DeviceMotion,
    private flashlight: Flashlight,
    private toastCrontroller: ToastService) {
      
     }

  emailRecuperado: string | any = this.herramientasLogin.obtenerEmail()?.split('@')[0];
  contraseñaRecuperada: string ="";
  subscription: any;   
  
  clave:string = "";
  botonApretado:boolean = false;
  posicionActualTelefono = 'inicio';
  posicionAnteriorCelular = 'horizontal';

  usarFlashPrimeraVez: boolean = true;
  isModalOpen = false;
  alarmActivated: boolean = false;   
  imagenBoton:string = "/assets/imagenes/botonApagado.png";
  estadoBoton:string = "BOTON APAGADO";
  audioLeft = '../../../assets/audio/robandoIz.mp3';
  audioRight = '../../../assets/audio/robandoDer.mp3';
  audioVertical = '../../../assets/audio/quehacemo.mp3';
  audioHorizontal = '../../../assets/audio/dejaEsoAhi.mp3';
  audioUltimatum = '../../../assets/audio/ayuda.mp3';
  
  ngOnInit() {
    this.recuperarContraseñaUsuario();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  recuperarContraseñaUsuario()
  {
    
    switch(this.emailRecuperado)
    {
      case 'usuario':
        this.contraseñaRecuperada = "3333333";
        break;
      case 'admin':
        this.contraseñaRecuperada = "1111111";  
        break;
      case "invitado":
        this.contraseñaRecuperada = "2222222";
        break;    
      case "anonimo":
       this.contraseñaRecuperada = "4444444";
       break;
      case "tester":
        this.contraseñaRecuperada = "5555555";
        break;
    }
  }

  manjeadorBoton()
  {
    if(!this.alarmActivated)
    {
      this.alarmActivated = !this.alarmActivated;
      this.cambiarImagenBoton();
    }
    else
    {
      this.setOpen(this.alarmActivated);    
    }
  }

  desactivarAlarma()
  {
    console.log(this.clave);
    if(this.clave == this.contraseñaRecuperada)
    {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.setOpen(false);
      this.alarmActivated = !this.alarmActivated;
      this.cambiarImagenBoton();
      this.toastCrontroller.crearToast("Se ha desactivado la alarma",'middle',"success");
    }
    else
    {
      this.toastCrontroller.crearToast("CONTRASEÑA INCORRECTA",'bottom',"danger").then(()=>{
        this.accionUltimatum();
      });
      
    }
  }

  activarSonido(rutaSonido:string)
  {
    const audio = new Audio(rutaSonido);
    audio.play();
  } 

  cerrarSesion()
  {
    this.herramientasLogin.cerrarSesion();
  }

  cambiarImagenBoton()
  {
    if(this.imagenBoton == "/assets/imagenes/botonApagado.png")
    {
      this.imagenBoton="/assets/imagenes/botonEncendido.png";
      this.estadoBoton="BOTON ENCENDIDO";
    }
    else
    {
      this.imagenBoton="/assets/imagenes/botonApagado.png";
      this.estadoBoton="BOTON APAGADO";
    }
  }

  cambiarShadow()
  {
    let sombra = '';

    if(this.botonApretado)
    {
      sombra = "0 15px 0 #01420a";
    }
    else
    {
      sombra = "0 15px 0 #490202";
    }

    return sombra;
  }

  cambiarColorBoton()
  {
    let colorRetorno = "";
    if(this.botonApretado)
    {
      colorRetorno = "green";
    }
    else
    {
      colorRetorno = "red";
    }
    return colorRetorno;
  }

  iniciarDetector()
  {
    this.botonApretado = !this.botonApretado;
    if(this.botonApretado)
    {
      this.toastCrontroller.crearToast("Se ha iniciado la alarma",'middle',"success");
        this.subscription = this.deviceMotion
      .watchAcceleration({ frequency: 300 })
      .subscribe((acceleration: DeviceMotionAccelerationData) =>{
        if (acceleration.x > 5)//izq
        {
          this.posicionActualTelefono = 'izquierda';
          this.accionMoverIzquierda();
        }
        else if(acceleration.x < -5 )//derecha
        {
          this.posicionActualTelefono = "derecha";
          this.accionMoverDerecha(); 
        }
        else if (acceleration.y >= 9)//lo levanto vertical
        {    
          this.posicionActualTelefono = 'vertical';     
          this.accionMoverVertical();                            
        }
        else if(acceleration.z >= 9 &&
          acceleration.y >= -1 &&
          acceleration.y <= 1 &&
          acceleration.x >= -1 &&
          acceleration.x <= 1)
          {  
            this.posicionActualTelefono = 'horizontal';   
            this.accionMoverHorizontal();     
          }
      }); 
    }
        
  }

  accionMoverIzquierda()
  {
    if (this.posicionActualTelefono != this.posicionAnteriorCelular)
    {
      this.activarSonido(this.audioLeft);
      this.posicionAnteriorCelular = "izquierda";

    }
  }

  accionMoverDerecha()
  {
    if (this.posicionActualTelefono != this.posicionAnteriorCelular)
    {
      this.activarSonido(this.audioRight);
      this.posicionAnteriorCelular = "derecha";

    }  
  }

  accionUltimatum()
  {
    this.flashlight.switchOn();
    this.vibration.vibrate(5000); 
    this.activarSonido(this.audioUltimatum);
    setTimeout(() => {
      this.flashlight.switchOff();
    }, 5000);
  }

  accionMoverVertical()
  {
    if (this.posicionActualTelefono != this.posicionAnteriorCelular)
    {

        this.flashlight.switchOn();
        this.posicionAnteriorCelular = "vertical";
        setTimeout(() => {
          this.flashlight.switchOff();
        }, 5000);
        this.activarSonido(this.audioVertical);

      
      
    }    
  }

  accionMoverHorizontal()
  {
    if (this.posicionActualTelefono != this.posicionAnteriorCelular)
    {
      this.activarSonido(this.audioHorizontal);
      this.vibration.vibrate(5000); 
      this.posicionAnteriorCelular = "horizontal";
    }
  }

}
