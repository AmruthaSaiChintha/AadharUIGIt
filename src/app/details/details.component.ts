import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
declare var Tesseract: { recognize: (arg0: string, lang?: string, options?: { [key: string]: any }) => Promise<{ text: any; }>; };

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  Result?: string;
  firstName: string = '';
  lastName: string = '';
  age: number | null = null;
  address: string = '';
  phone: string = '';
  aadhar: string = '';
  email: string = '';
  aadharNumber?: string;


  loading?: boolean;
  // Add a Promise that resolves when OCR is done
  private ocrPromise: Promise<void> | null = null;




  constructor(
    public userService: UserService,
    public fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 

      aadharNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      email: ['', [Validators.required, Validators.email]], 
      profileImage: [null, Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }



  test(): any {

    this.loading = true;
    this.extractDataFromImage();

    if (this.ocrPromise) {
      this.ocrPromise.then(() => {

        if (this.checkMatch()) {
          const formData = this.form.getRawValue();
          console.log('Form Data:', formData);
          // console.log('Extracted Text:', this.Result);

          this.userService.create(formData).subscribe(
            (res: any) => {
              this.loading = false;

              console.log('Account signed up successfully!');
              this.router.navigate(['viewpage',this.form.value.email])
              console.log(res);

            },
            (err: any) => {
              this.loading = false;

              console.log(err);
            }
          );
        } else {
          this.loading = false;
          const fileInput = document.getElementById('profileImage') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Clear the selected file
          }
          
          
          this.form.reset();
          this.selectedFile = null;



          alert('No matching text found.');
        }



      }).catch(() => {
        this.loading = false;
        // Handle OCR error
      });
    } else {
      this.loading = false;
      // Loading setup
    }
  }


  onFileSelected(event: any) {
    console.log();
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

    }
  }
  extractDataFromImage() {




    const options = {
      lang: 'eng',
      tessedit_char_whitelist: '0123456789',
    };

    const reader = new FileReader();

    // Create a new promise for OCR
    this.ocrPromise = new Promise<void>((resolve, reject) => {

      reader.onload = (e: any) => {
        Tesseract.recognize(e.target.result, options.lang, options)
          .then((result: { text: any }) => {
            this.Result = result.text;
            this.aadharNumber = this.extractAadheerNumber(this.Result)
            resolve(); // Resolve the promise when OCR is done
          })
          .catch(error => {
            console.error('OCR Error:', error);
            this.Result = 'Error: Unable to perform OCR.';
            reject(); // Reject the promise on OCR error
          })
      };

      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    });
  }
  extractAadheerNumber(res: any): any {
    const aadharNumberRegex = /\b\d{4} \d{4} \d{4}\b/g;

    // Extracting the credit card-like numbers from the text
    const extractedNumbers = res.match(aadharNumberRegex);

    // Storing the matched number in a string
    const aadharNumberNumberString = extractedNumbers ? extractedNumbers.join('') : '';


    // Remove spaces between numbers
    return aadharNumberNumberString.replace(/\s/g, '');

  }



  navigate()
  {
    this.router.navigateByUrl("emailpage")
  }
  navigate1()
  {
    this.router.navigateByUrl("contactus")
  }
  navigate2()
  {
    this.router.navigateByUrl("users")
  }

  checkMatch(): any {
    const lowercasedResult = this.Result?.toLowerCase().trim();
    // const lowercasedfirstname = this.f['firstName'].value.toLowerCase().trim();
    // const lowercasedlastName = this.f['lastName'].value.toLowerCase().trim();
    // const lowercasedAddress = this.f['address'].value.toLowerCase().trim();
    // const lowercasedphone = this.f['phone'].value.toLowerCase().trim();
    const lowercasedaadhar = this.f['aadharNumber'].value;
    // const lowercasedemail = this.f['email'].value.toLowerCase().trim();


    console.log('Result:', lowercasedResult);
    // console.log('First Name:', lowercasedfirstname);
    // console.log('Last Name:', lowercasedlastName);
    // console.log('Address:', lowercasedAddress);
    // console.log('Phone:', lowercasedphone);
    console.log('Aadhar:', lowercasedaadhar);
    // console.log('Email:', lowercasedemail);



    console.log(this.aadharNumber);
    console.log(lowercasedaadhar);


    if (
      // lowercasedResult?.includes(lowercasedfirstname) ||
      // lowercasedResult?.includes(lowercasedlastName) ||
      // lowercasedResult?.includes(lowercasedAddress) ||
      // lowercasedResult?.includes(lowercasedphone) ||
      // lowercasedResult?.includes(lowercasedemail) ||
      this.aadharNumber == lowercasedaadhar

    ) {


      // Delay navigation for 10 milliseconds
      return true;
    } else {

      return false;
    }
  }

}
