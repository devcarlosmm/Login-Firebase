import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

const Swal = require('sweetalert2');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuario:UsuarioModel;
  recordarme:boolean=false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
    if(localStorage.getItem("email")){
      this.usuario.email=localStorage.getItem("email");
      this.recordarme=true;
    }
  }

onSubmit(form:NgForm){

  if(form.invalid){ return; }

  Swal.fire({
    title: 'Registro',
    text: 'Registrando sus datos...',
    allowOutsideClick:false,
    icon:'info'
  })
  Swal.showLoading();

  // en el subscribe recibimos la respuesta de firebase
  this.auth.nuevoUsuario(this.usuario)
  .subscribe(response =>{

    if(this.recordarme){
      localStorage.setItem("email",this.usuario.email);
    }
    console.log(response);
    Swal.close();
    
    this.router.navigateByUrl('/home');

  },(err)=>{

    Swal.fire({
      title: 'Error en el registro',
      text: `${err.error.error.message}`,
      icon:'error'
    })
    console.log(err.error.error.message);
  });

}
}
