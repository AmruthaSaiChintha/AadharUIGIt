import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-viewpageid',
  templateUrl: './viewpageid.component.html',
  styleUrls: ['./viewpageid.component.css']
})
export class ViewpageidComponent {
  aadharNumber:any;
  apiUrl='http://localhost:90/api/GoogleDriveProxy';
  passportImageUrl:string=''
  
    
  details: any = {};
  
  
  
    constructor(private route: ActivatedRoute,
      private userdetails: UserService,
      private router:Router,
      private http:HttpClient,
      private ngZone: NgZone){
      
      }
  
      ngOnInit(): void {
        this.route.params.subscribe(params => {
          this.aadharNumber = params['id']; 
        });
      
        this.userdetails.getuserbyid(this.aadharNumber).subscribe(
          (response: any) => {
            console.log("success");
            this.details = response; // Store the response in the 'details' variable
            console.log(this.details);
            this.verifyPassport(this.details.aadharNumber)
          },
          (error: any) => {
            console.error("Error fetching user details:", error);
          }
        );
      }
      
  
  
  
      navigate()
      {
        this.router.navigateByUrl('emailpage')
      }
  
      submitForm() {
        this.router.navigate(['passport'])
      }
      update(id:number){
        this.router.navigate(['/update', id])
      }
      verifyPassport(aadharNumber: string) {
        console.log(aadharNumber);
        if (!this.details || !aadharNumber) {
          console.error('Passport details are not available.');
          return;
        }
     
        const fileNameWithExtension = `${aadharNumber}.jpg`;
        console.log(fileNameWithExtension);
     
        this.http.get(`${this.apiUrl}?fileName=${fileNameWithExtension}`, { responseType: 'blob' }).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            this.ngZone.run(() => {
              this.passportImageUrl = URL.createObjectURL(response);
              console.log("Image fetched successfully!!");
            });
          },
          (error) => {
            console.error("Error fetching image:", error);
          }
        );
      }
      downloadImage(imageUrl: string) {
 
        const a = document.createElement('a');
   
        a.href = imageUrl;
        
        a.download = 'user_image.jpg'; 
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
      }
  
  }
  
