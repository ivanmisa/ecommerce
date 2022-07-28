import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import {GLOBAL} from '../../services/global';
import { ProductService } from '../../services/product.service';
import { UploadService } from '../../services/upload.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  providers: [UserService, ProductService, UploadService]
})
export class CreateProductComponent implements OnInit {
    product: Product;
    token:string;
    color: string;
    number:number = 0;
    url;
    urls = [];
    arrayImages = [];
    photoSelected: string | ArrayBuffer | File;
    load = false;
    status: string;

    constructor(
        private toastr: ToastrService,
        private _userService: UserService,
        private _productService: ProductService,
        private _uploadService: UploadService,
        private _router: Router
    ) { 
        this.url = GLOBAL.url;
        this.product = new Product("","","","",0,"",[{color:"", number:0}],"","");
        this.token = this._userService.getToken();
    }

    ngOnInit(): void {
        this.product.color.splice(0, 1);

        if(this.token == undefined){
            this.showStatus('Error', 'Error', "Inicia sesion"); 
        }
    }


    formValidation(form){
        let element = document.getElementById("product");
        console.log("validacion");

        if(form.form.status == "VALID"){
            this.createProduct(); 
        }

        if(form.form.status == "INVALID"){
            element.classList.add('was-validated');
        }
    }

    createProduct():void{
        console.log("asd")
        if(this.token == undefined){
            this.showStatus('Error', 'Error', "Inicia sesion"); 
        }else{
            this.load = true;      
            this._productService.addProduct(this.token, this.product).subscribe(
                response => {              
                    if(response.product){
                        this.uploadImagesPost(response.product._id);
                    }   
                },
                error => {                     
                    this.load = false;
                    this.status = <any>error.error.error;
                    this.showStatus('Error', 'Error', this.status); 
                    if(error.error.error == 'El token no es valido'){
                        localStorage.removeItem('identity');
                        localStorage.removeItem('token');
                        
                    }    
                }
            ); 
        }
    }
    

    uploadImagesPost(id): void{      
        this.load = true;
        if(this.urls && this.urls.length){
            //Subir Imagen
            this._uploadService.makeFileRequest(this.url+'upload-image-product/'+id, [], this.urls, this.token, 'image')
            .then((result:any) =>{
                console.log(result);
                if(result.product._id){
                    this.showStatus('Success', 'Guardado', 'Producto creado'); 
                    this._router.navigate(['/home',]); 
                }
                this.load = false;              
            });  
        }
    }

    addColor():void{
        console.log(this.color)
        let element = {color: this.color, number: this.number};
        this.product.color.push(element);  
        this.number = 0;
        this.color = "";
    }

    onSelectFile(event) :void{     
        this.load = true;   
        if (event.target.files && event.target.files[0]) {
            let filesAmount = event.target.files.length;  
         
            for (let i = 0; i < filesAmount; i++) {
                if(event.target.files[i].size > 3000000){
                    this.status = "La imagen debe de pesar menos de 3MB";
                    this.showStatus('Error', 'Error', this.status); 
                    this.load = false;
                }else{
                    let filesToUpload = <Array<File>>event.target.files[i];
                    let reader = new FileReader();  
                    reader.onload = (event:any) => {  
                        this.load = false;
                        if(this.urls.length < 3){                   
                                this.urls.push(filesToUpload);
                                this.arrayImages.push(event.target.result);         
                        } else {
                            this.status = "El limite de imagenes son 3";
                            this.showStatus('Error', 'Error', this.status); 
                        }  
                    } 
                    reader.readAsDataURL(event.target.files[i]);
                } 
            }
        }
    }

    removefile(array): void{
        this.urls.splice(array, 1);
        this.arrayImages.splice(array, 1);
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
