import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';
import { getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-post-component',
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Generate blog post with AI</mat-label>
      <input matInput [(ngModel)]="recipientMessage" placeholder="Example: ai,tech,innovation" />
    </mat-form-field>
    <mat-icon class="create-post" matTooltip="AI Start" (click)="aiBlogPost(email, recipientMessage)">create</mat-icon>

  `
})
export class BlogPostComponent extends JsonFormsControl {

  recipientMessage: string = '';
  email: string = environment.mainEmail;
  dataAsString: string;

  constructor(service: JsonFormsAngularService, private snackBar: MatSnackBar) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.dataAsString = JSON.stringify(props.data, null, 2);
  }

  aiBlogPost(email = this.email, recipientMessage: string) {
    this.snackBar.open('Blog Post generation Initiated...', 'Close', {
      duration: 5000,
    });


    const intervalId = setInterval(() => {
      this.snackBar.open('In progress...', 'Close', {
        duration: 10000,
      });
    }, 15000);

    const url = `${environment.myResumeURL}/blog?email=${email}`;
    const data = {
      recipientMessage
    };
    const headers = {
      'Content-Type': 'application/json',
      'API_KEY': environment.functionApiKey
    };

    axios.post(url, data, { headers })
      .then((response) => {
        console.log(response.data);

        clearInterval(intervalId);
        this.snackBar.open('AI bots are finishing off..', 'Close', {
          duration: 5000,
        });
      })
      .catch((error) => {
        console.log(error);

        clearInterval(intervalId);
        this.snackBar.open('Error generating blog post', 'Close', {
          duration: 5000,
        });
      });
  }


}
