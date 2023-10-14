// import { Component, Output, EventEmitter } from '@angular/core';
// import { NgRedux } from '@angular-redux/store';
// import { fileUpload } from './utils/file-upload-action';

// @Component({
//   selector: 'app-file-upload',
//   template: `
//     <input type="file" (change)="onFileSelected($event)" />
//   `
// })
// export class FileUploadComponent {
//   constructor(private ngRedux: NgRedux<any>) { }

//   onFileSelected(event) {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       const fileContent = reader.result as string;
//       this.ngRedux.dispatch(fileUpload(fileContent));
//     };
//     reader.readAsDataURL(file);
//   }
// }

