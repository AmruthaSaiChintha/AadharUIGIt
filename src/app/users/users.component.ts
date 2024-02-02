import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

 
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  user: any[] = [];
  isImageLoadedMap: { [key: number]: boolean } = {};
  @ViewChild('imagePlaceholder', { static: false }) imagePlaceholder!:ElementRef;
  apiUrl = 'http://localhost:8033/api/GoogleDriveProxy';
  passportImageUrl: string = '';
 
 
  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private http: HttpClient,
    private router:Router
  ) {}
 
  ngOnInit(): void {
    this.userService.getAll().subscribe(
      (res: any) => {
        this.user = res;
        console.log(res);
 
        this.user.forEach((user) => this.verifyPassport(user.aadharNumber, user.vId));
      },
      (err) => {
        console.log(err);
      }
    );
  }
 
  getPassportImageUrl(aadharNumber: string): string {
    const fileNameWithExtension = `${aadharNumber}.jpg`;
    return `${this.apiUrl}?fileName=${fileNameWithExtension}`;
  }
 
  imageLoaded(vId: number): void {
    // Hide the placeholder image once the actual image is loaded
    this.renderer.setProperty(this.imagePlaceholder.nativeElement, 'hidden', true);
    this.isImageLoadedMap[vId] = true;
  }
 
 
 
  getChunks(arr: any[], chunkSize: number): any[] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete the user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUsser(id).subscribe(
          (res: any) => {
            console.log('Deleted successfully!!');
            console.log(res);
            this.user = this.user.filter((user) => user.id !== id);
          },
          (error:any) => {
            console.error('Error deleting user:', error);
          }
        );
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      }
    });
  }
  
 
  verifyPassport(aadharNumber: string, vId: number): void {
    if (!aadharNumber) {
      console.error('Passport details are not available.');
      return;
    }
 
    const fileNameWithExtension = `${aadharNumber}.jpg`;
 
    this.http.get(`${this.apiUrl}?fileName=${fileNameWithExtension}`, { responseType: 'blob' }).subscribe(
      (response: any) => {
        this.passportImageUrl = URL.createObjectURL(response);
        console.log('Image fetched successfully!!');
      },
      (error) => {
        console.error('Error fetching image:', error);
      }
    );
  }
 
 
 
  update(id:number){
    this.router.navigate(['/updatenew', id])
  }
}