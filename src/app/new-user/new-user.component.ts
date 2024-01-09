import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

declare var Tesseract: {
  recognize: (arg0: string, lang?: string, options?: { [key: string]: any }) => Promise<{
    blocks: any; data: any;
  }>;
};

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500),
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class NewUserComponent implements OnInit {
  form!: FormGroup;

showValidationMessages: boolean = false;

  passportImageUrl: string = '';
  fileName: string = '';
  showVerificationLoader: boolean = false;
  selectedFile: File | null = null;
  Result = 'Recognizing...';
  extractedText: string = '';
  words: string[] = [];
  @ViewChild('passportImage') passportImage: ElementRef | undefined;
  isTextMatched: boolean = false;
  loading: boolean = false;
  showAlert = false;
  isPassportNumberDuplicated = false;
 

  apiUrl = 'http://localhost:8033/api/GoogleDriveProxy'; // Update with your backend API URL
  vId!: number;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private http: HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(12)]],
      lastName: ['', [Validators.required, Validators.maxLength(12)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.form.valueChanges.subscribe(() => {
      this.showAlert = false;
    });

    const script = document.createElement('script');
    script.src = 'https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js';
    script.onload = () => {
      console.log('Tesseract.js has been loaded successfully.');
    };
    document.head.appendChild(script);
  }

  get f() {
    return this.form.controls;
  }

  isDataMatching(recognizedText: string): boolean {
    const formValues = this.form.value;
    const lowercasedResult = recognizedText.replace(/\s/g, '');

    return (
      lowercasedResult.includes(formValues.firstName) ||
      lowercasedResult.includes(formValues.lastName) ||
      lowercasedResult.includes(formValues.age) ||
      lowercasedResult.includes(formValues.phone) ||
      lowercasedResult.includes(formValues.aadharNumber) ||
      lowercasedResult.includes(formValues.address) ||
      lowercasedResult.includes(formValues.email)
    );
  }

  onSubmit() {
    this.form.markAllAsTouched();

    // If the form is invalid, prevent further actions (e.g., form submission)
    this.showValidationMessages = this.form.invalid && this.form.touched;

    if (this.form.invalid) {
      return;
    }

    this.verifyPassport();
  }

  verifyPassport() {
    console.log(this.form.value);
    const aadharNumber = this.form.get('aadharNumber')?.value;

    if (!aadharNumber) {
      console.error('aadharNumber  is empty or undefined');
      return;
    }
    this.loading = true;
    console.log(aadharNumber);


  
    
      console.log("Image Related");

        this.loading = true;
        const fileNameWithExtension = aadharNumber + '.jpg';
        console.log('Constructed URL:', `${this.apiUrl}?fileName=${fileNameWithExtension}`);
console.log(fileNameWithExtension);
        this.http.get(`${this.apiUrl}?fileName=${fileNameWithExtension}`, { responseType: 'blob' }).subscribe(
          (response: any) => {
            this.passportImageUrl = URL.createObjectURL(response);
            console.log('Image URL:', this.passportImageUrl);
            console.log('Image fetched');

            this.convertImageToDataUrl(this.passportImageUrl)
              .then((dataUrl) => {
                Tesseract.recognize(dataUrl, 'eng', { logger: (info: any) => console.log(info) })
                  .then((response) => {
                    console.log('Tesseract Response:', response);

                    const recognizedText = response.blocks?.[0]?.paragraphs?.[0]?.text || '';
                    this.loading = false;
                    console.log('Recognized Text:', recognizedText);

                    if (this.isDataMatching(recognizedText)) {
                      this.saveUserDataAndImage();
                    } else {
                      Swal.fire('Error', 'Verification Failed. Data does not match Please enter the correct details.', 'error');
                    }
                  })
                  .catch((error) => {
                    this.loading = false;
                    console.error('Tesseract Error:', error);
                  });
              })
              .catch((error) => {
              
                console.error('Error:', error);
              });
          },
          (error) => {
            console.error('HTTP Error:', error);
          },
        );
     
  
  }
  handleImageError() {
    console.error('Error loading image.');
  }
  

  saveUserDataAndImage(): void {
    // Check again before proceeding to save user data and image
    if (this.isPassportNumberDuplicated) {
      Swal.fire('Error', 'Passport number already exists. Please use another one.', 'error');
      this.isPassportNumberDuplicated = false;
      this.loading = false;
      return;
    }

    this.user.create(this.form.value).subscribe(
      (response) => {
        const typedResponse = response as { id: number };
        console.log('Verified user details added successfully');
        console.log(typedResponse.id);

        Swal.fire({
          title: 'Verification Successful',
          text: 'Your details have been verified successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Navigate to the next page after clicking OK
          this.router.navigate(['/viewpageid', typedResponse.id]);
          console.log(typedResponse.id)
          this.loading = false;
          this.showVerificationLoader = false;
        });
      },
      (err) => {
        console.log(err);
      },
    );
  }
navigate()
{
  this.router.navigateByUrl("emailpage")
}
  convertImageToDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
        } else {
          reject('Could not get 2D context');
        }
      };

      img.onerror = () => {
        reject('Error loading image');
      };

      img.src = url;
    });
  }
}
