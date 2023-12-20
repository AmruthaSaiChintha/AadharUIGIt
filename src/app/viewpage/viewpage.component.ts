import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewpage',
  templateUrl: './viewpage.component.html',
  styleUrls: ['./viewpage.component.css']
})
export class ViewpageComponent {
  aadharNumber:string = '';
apiUrl='https://localhost:44348/api/GoogleDriveProxy';
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
        this.aadharNumber = params['aadharNumber']; 
      });
    
      this.userdetails.getuserbyaadhar(this.aadharNumber).subscribe(
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
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.passportImageUrl;
      link.download = 'user_image.jpg'; 
      link.click();
    }

}
