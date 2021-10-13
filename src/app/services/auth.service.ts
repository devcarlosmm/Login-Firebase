import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UsuarioModel } from '../models/usuario.model';
import { map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyAsvVJmRxm6rQvobI13JcgsmhyhV518LB8";
  userToken: string;

  //crear nuevo usuario
    //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login con usuario
    //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http:HttpClient) {
    this.leerToken();
   }

  logout(){
    localStorage.removeItem("token");
  }


  nuevoUsuario(usuario:UsuarioModel){
    const authData={
/*       email:usuario.email,
      password:usuario.password, */
      ...usuario,
      returnSecureToken:true
    };
    return this.http.post(`${this.url}signUp?key=${this.apiKey}`, authData
    ).pipe(// vamos a meter la respuesta en un pipe
      // Y vamos a usar map como intermediario para almacenar el token si viene
      map(respuesta =>{
        console.log("Entramos en el map de rxjs")
        this.guardarToken(respuesta['idToken']);
        return respuesta;
      })
    );
  }


  login(usuario:UsuarioModel){
    const authData={
            ...usuario,
            returnSecureToken:true
          };
          return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData
          ).pipe(// vamos a meter la respuesta en un pipe
            // Y vamos a usar map como intermediario para almacenar el token si viene
            map(respuesta =>{
              console.log("Entramos en el map de rxjs")
              this.guardarToken(respuesta['idToken']);
              return respuesta;
            })
          );
  }



  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem("token",idToken);

    let hoy= new Date();
    hoy.setSeconds(3600);
    localStorage.setItem("expira",hoy.getTime().toString()  );
  }


  leerToken(){
    if(localStorage.getItem("token")){
      this.userToken=localStorage.getItem("token");
    }else{
      this.userToken="";
    }

    return this.userToken;
  }

  estaAutenticado():boolean{

    if(this.userToken.length<2){
      return false;
    }

    const expira= Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate>new Date()){
      return true;
    }else{
      return false;
    }


  }
}
