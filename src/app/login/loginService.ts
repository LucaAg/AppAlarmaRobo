import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, NavController, ToastController } from "@ionic/angular";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({providedIn:"root"})
export class LoginService{

    constructor(private router:Router, 
        private toastCtrl:ToastController,
        private navCtrl: NavController,
        public loadingController : LoadingController,
        public loadinCerrarSesion : LoadingController){}


    token:string = "";

    async crearToast(mensaje:string, posicion: 'top' | 'middle' | 'bottom', colores:string)
    {
      let toast = this.toastCtrl.create(
        {
          message: mensaje,
          duration: 3000,
          position: posicion,
          icon: "alert-outline",
          color: colores
        }
      );
        
      (await toast).present();
    }

    obtenerEmail()
    {
        return firebase.auth().currentUser?.email;
    }

    login(email:string|any, password:string|any){
        firebase.auth().signInWithEmailAndPassword(email,password).then(
            response=>{
                firebase.auth().currentUser?.getIdToken().then(
                    token=>{
                        this.showLoading();
                        this.token=token;
                        this.crearToast('Se ha logueado exitosamente!','bottom','success');
                        this.navCtrl.navigateRoot(['/alarma']);                
                    }
                )
            }
        ).catch(error=>{
            this.crearToast('Error al loguearse, la cuenta no existe!','bottom','danger');
        });
        
    }

    cerrarSesion()
    {
        firebase.auth().signOut().then(response=>{        
            this.showLoadingCerrarSesion();   
            this.token = "";
            this.crearToast('Se ha cerrado sesión correctamente','bottom','success');
            this.router.navigate(['login']);  
        }).catch(error=>{
            this.crearToast('Error inesperado, no se pudo cerrar sesión','bottom','danger');
        });     
    }

    getIdToken(){
        return this.token;
    };

    async showLoading() {
        const loading = await this.loadingController.create({
          message: 'Iniciando sesión...',
          duration: 2000,
          spinner: "dots",
        });
    
        loading.present();
      }

      async showLoadingCerrarSesion() {
        const loading = await this.loadingController.create({
          message: 'Cerrando Sesión...',
          duration: 2000,
          spinner: "dots",
        });
    
        loading.present();
      }
}