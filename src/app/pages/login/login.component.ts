import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

const Swal = require('sweetalert2')

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel = new UsuarioModel();
  recordarme:boolean=false;

  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {

    if( localStorage.getItem("email") ){
      this.usuario.email= localStorage.getItem("email");
      this.recordarme=true;
    }
  }

  login(form:NgForm){
    if(form.invalid){ return; }

    Swal.fire({
      title: 'Logueando',
      text: 'Espere por favor...',
      allowOutsideClick:false,
      icon:'info'
    })
    Swal.showLoading();

    /* console.log(this.usuario); */
    this.auth.login(this.usuario)
    .subscribe(response =>{

      console.log(response);
      Swal.close();

      if(this.recordarme){
        localStorage.setItem("email",this.usuario.email);
      }
      
      this.router.navigateByUrl('/home');

    }, (err)=>{
      Swal.fire({
        title: 'Error en el login',
        text: `${err.error.error.message}`,
        icon:'error'
      })
      console.log(err.error.error.message);
    })
  }
}
