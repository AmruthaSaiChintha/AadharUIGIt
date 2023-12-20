// image.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    // You can now do something with the selected file, like displaying a preview or uploading it to a server.
    console.log(file);
  }

  navigate() {
    // Implement the navigation logic here
    console.log('Navigate function called');
  }
}
