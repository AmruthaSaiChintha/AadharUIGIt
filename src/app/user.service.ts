import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '@angular/compiler';
import { Observable, catchError } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';
import { User } from './user';
import { LoginResponse } from './models/login-response';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http:HttpClient, private jwt: JwtHelperService,
    private cookieService:CookieService) { }
  apiUrl="https://localhost:44348/api/userdata";

  baseUrl="https://localhost:44348/api/UserList/Login"

  private apiUrl1 = 'https://localhost:44348/api';

  userList='https://localhost:44348/api/GoogleDriveProxy'

  finalUser='https://localhost:44348/api/FinalUsers'

  verify(userdata:any){
    return this.http.post(this.apiUrl+'/authenticat/',userdata);
  }
  getAadharImageURL(aadharNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GoogleDriveProxy?aadharNumber=${aadharNumber}`).pipe(
      catchError((error) => {
        console.error('Error fetching Aadhar image URL:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }
  
  create(user:any): Observable<any> {
  
    return this.http.post<any>(this.apiUrl,user);
  
  }
  user(details:any){
    return this.http.post(this.finalUser,details)
  }
   
  create11(user:any):Observable<any> {
    return this.http.post<any>(this.userList,user)
  }
  create1(user:any): Observable<any> {
  
    return this.http.post<any>(this.userList,user);
  
  } 
  
  updateUserDetails(id:number, user: any): Observable<any> {

    const updateUrl = `${this.apiUrl}/${id}`; 

    return this.http.put(updateUrl, user);
  }
 
 
  update(user:any, id:number){
    return this.http.put(this.apiUrl+'/'+id,user);
  }
  updateUser(id:number, user: any):Observable<any> {
    return this.http.put(this.apiUrl+'/'+id, user);
  }
  getUser(id:number):Observable<any> {
    return this.http.get(this.apiUrl+'/'+id);
  }
  getAll(): Observable<any> {
  
    return this.http.get(this.apiUrl)
}
checkAadharExistence(passportNumber: string): Observable<boolean> {
  const url = `${this.apiUrl}/check-aadhar/${passportNumber}`;
  return this.http.get<boolean>(url);
}
  getUser1(id:number):Observable<any> {
    return this.http.get(this.apiUrl1+'/'+id);
  }
  verifyaadhar(aadharNumber:string)
  {
    return this.http.get(this.apiUrl+'/check-aadhar/'+aadharNumber)
  }
  getuserbyemail(useremail:string):any{
    return this.http.get(this.apiUrl+'/by-email/'+useremail)
  }
  getuserbyaadhar(aadharNumber:string):any{
    return this.http.get(this.apiUrl+'/by-aadhar/'+aadharNumber)
  }
  getuserbyid(id:number){
    return this.http.get(this.apiUrl+'/'+id)
  }
  deleteUsser(id:number):any{
    return this.http.get(this.userList+'/by-id/'+id)
  }
  uploadImageAndDetails(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/ImageProof`, data);
  }
  login(loginInfo: any):Observable<LoginResponse> {
    let params = new HttpParams()
      .append('email', loginInfo.email)
      .append('password', loginInfo.password);
    return this.http.get<LoginResponse>(this.baseUrl , {
      params: params,
      
    });
  }
  //  createUserList(userData: any): Observable<any> {
   
  //   const userDataWithUserType = { ...userData, userType: 'User' };
 
  //   return this.http.post(this.userList, userDataWithUserType);
  // }
  createUserList(user: User): Observable<any> {
    return this.http.post(this.userList, user);
  }
  getTokenUserInfo(): User | null {
    if (!this.isLoggedIn()) return null;
    let token=this.cookieService.get('Authorization');
    token=token.replace('Bearer','');
    const decodedToken:any=jwtDecode(token);
    console.log('Decoded Token:', token);
  
    let user: User = {
      id: decodedToken.id,
      email: decodedToken.email,
      password: decodedToken.password,
      userType: decodedToken.userType === 'ADMIN' ? 'admin' : 'user',
      username: ''
    };
    
  
    console.log('User:', user);
    return user;
  }
  
  deleteToken(): void {
    this.cookieService.delete('Authorization');
  }
   
  saveToken(token: string) {
    localStorage.setItem('access_token', token);
    console.log('Token saved to local storage:', token);
  }
  
   
  isLoggedIn(): boolean {
    return this.cookieService.get('Authorization')!==null;
  }
   
 
}
