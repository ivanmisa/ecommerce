import { Component, OnInit } from '@angular/core';
import{ ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [ProductService]
})
export class HomeComponent implements OnInit {
    load: Boolean = false;
    products =[];
    status: string;
    gender: string = 'all';

    constructor(
        private _productService: ProductService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.getRamdomPost();
    }


    getRamdomPost():void{   
        this.load = true;
        this._productService.getAllProduct(this.gender).subscribe(
            response => {
                this.load = false;
                if(response.products){
                    this.products = response.products;   
                   
                }
            },
            error => {
                this.load = false;
                this.status = <any>error.error.error;
                this.showStatus('Error', 'Error', this.status); 
                
            }
        );
    }


    showStatus(status, title, body):void {
        if(status == 'Success'){
            this.toastr.success(body, title); 
        }
        if(status == 'Error'){
            this.toastr.error(body, title); 
        }
    }

    changeGender():void{
        this.getRamdomPost();
    }

}
