import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl:ToastController) { }

  async crearToast(mensaje:string, posicion: 'top' | 'middle' | 'bottom', colores:string)
  {
    let toast = this.toastCtrl.create(
      {
        message: mensaje,
        duration: 2000,
        position: posicion,
        icon: "alert-outline",
        color: colores
      }
    );
      
    (await toast).present();
  }
}
