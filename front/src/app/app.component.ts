import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { User }  from './models/user';
import { UserService } from './services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements OnInit{
    @ViewChild('modalogin', {static: false}) openLogin: ElementRef;
    @ViewChild('modalsignup', {static: false}) openSignUp: ElementRef;
    user:User;
    token: string;
    load = false;
    identity;
    status: string;

    constructor(
        private _router: Router,
        private _userService:UserService,
        private toastr: ToastrService
    ) { 
        this.user = new User("","","","");
    }


    ngOnInit(): void {
        this.identity = this._userService.getIdentity();
    }

    ngDoCheck(){
        this.identity = this._userService.getIdentity();
    }

    openModal(type): void{
        if(type == 'login'){
            setTimeout( () => {
                this.openLogin.nativeElement.click();
            }, 650);  
        }

        if(type == 'signup'){
            setTimeout( () => {
                this.openSignUp.nativeElement.click();
            }, 650);  
        }
    }

    formValidation(form, nameForm){
        if(nameForm == "loginForm"){
            var element = document.getElementById("form-login");
        }
        if(nameForm == "signupForm"){
            var element = document.getElementById("form-signup");
        }
        if(form.form.status == "VALID"){
            if(nameForm == "loginForm"){
                this.Signin(form); 
            }
            if(nameForm == "signupForm"){
                this.Signup(form); 
            }
        }

        if(form.form.status == "INVALID"){
            element.classList.add('was-validated');
        }
    }


    Signin(loginForm){
        this.load = true;
        this._userService.signin(this.user).subscribe(
            response => {
                this.identity = response.user;
                this.token = response.token;
                if(this.identity || this.identity._id){
                       // PERSISTIR DATOS DEL USUARIO
                       this.user.password = '';
                       localStorage.setItem('identity', JSON.stringify(this.identity));
                       localStorage.setItem('token',this.token);
                       loginForm.reset(); 
                       this.load = false;  
                       window.location.reload();
                }
            },
            error => {
                this.load = false;
                this.user.password = '';
                this.status = <any>error.error.error;
                this.showStatus('Error', 'Error', this.status); 
                if(error.error.error == 'El token no es valido'){
                    localStorage.removeItem('identity');
                    localStorage.removeItem('token');
                    this.identity = null;
                    this._router.navigate(['/home']);
                }              
            }
        );
    }

    Signup(registerForm){ 
        this.load = true;      
        this._userService.signup(this.user).subscribe(
            response => {                 
                this.identity = response.user;
                this.token = response.token;
                if(this.identity || this.identity._id){
                   // PERSISTIR DATOS DEL USUARIO
                   this.user.password = '';
                   localStorage.setItem('identity', JSON.stringify(this.identity));
                   localStorage.setItem('token',this.token);
                   registerForm.reset(); 
                   this.load = false;   
                   window.location.reload();  
                } 
            },
            error => {                     
                this.load = false;
                this.status = <any>error.error.error;
                this.showStatus('Error', 'Error', this.status); 
                if(error.error.error == 'El token no es valido'){
                    localStorage.removeItem('identity');
                    localStorage.removeItem('token');
                    this.identity = null;
                    this._router.navigate(['/home']);
                }    
            }
        ); 
    }

    logout(){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this._router.navigate(['/']);
        window.location.reload();
    }


    showStatus(status, title, body) :void{
        if(status == 'Success'){
            this.toastr.success(body, title); 
        }
        if(status == 'Error'){
            this.toastr.error(body, title); 
        }
    }

}
