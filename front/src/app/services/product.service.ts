import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    url:string;

    constructor(public _http: HttpClient) { 
        this.url = GLOBAL.url;
    }


    addProduct(token, product):Observable<any>{
        let params = JSON.stringify(product);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization', token);

        return this._http.post(this.url+'createproduct', params, {headers: headers});
    }

    getAllProduct(gender):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.get(this.url+'getproducts/'+gender, {headers: headers});
    }
}
