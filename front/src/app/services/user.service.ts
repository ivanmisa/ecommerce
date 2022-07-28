import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    url:string;
    identity;
	token: string;

    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
   }

   signup(user: User): Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'signup', params, {headers:headers});
	}

	signin(user): Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type','application/json');

		return this._http.post(this.url+'signin', params, {headers: headers});
	}

    getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity')!);
		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');
		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}
}
