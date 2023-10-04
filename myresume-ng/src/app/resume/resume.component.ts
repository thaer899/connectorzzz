import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  providers: []
})
export class ResumeComponent implements OnInit, OnChanges {
  public post: any;
  public data: any;
  public resume: any;
  public quote: string;


  public menuItems = [
    { key: 'employment', label: 'Employment' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'interests', label: 'Interests' },
    { key: 'languages', label: 'Languages' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private readonly dataService: DataService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.post = router.url.replace('/resume/', '');
  }

  ngOnInit() {
    this.getQuote();
  }


  ngOnChanges() {
    // Add code here if needed
  }

  changeToMenu(menu: string) {
    this.post = menu;
  }

  getQuote() {
    const headers = {
      'Content-Type': 'application/json',
      'API_KEY': environment.message_api_key
    };
    const options = {
      headers: new HttpHeaders(headers),
      params: new HttpParams().set('email', environment.mainEmail)
    };

    const quoteURL = environment.functionURL + 'quote';
    this.http.post(quoteURL, {}, options).subscribe((response: any) => {
      if (response) {
        this.quote = response.choices[0].message.content;

      }
    });
  }


  scrollToTop() {
    const content = document.getElementById('content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
