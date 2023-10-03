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
    this.quote = "\"Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.\" - Christian D. Larson";
  }

  ngOnInit() {
    this.dataService.fetchData().subscribe(data => {
      console.log("Data from DataService:", data);
      this.resume = data.resume;
    });

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
    this.http.post(environment.messageURL, options).subscribe((response: any) => {
      if (response) {
        this.quote = response;
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
