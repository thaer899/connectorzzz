import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, Renderer2, Inject, ElementRef, AfterViewInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ThemeService } from '../services/theme.service';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { GAService } from '../services/ga.service';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  providers: []

})
export class ResumeComponent implements OnInit, OnChanges, AfterViewInit {
  private subscription: Subscription;
  @ViewChild('body') yourElementRef: ElementRef;

  public email: any;
  public post: any;
  public data: any;
  public resume: any;
  public quote: string;
  public mainEmail: any;
  public theme: any;
  public isBotQuotes: boolean = false;

  public menuItems = [
    { key: 'employment', label: 'Employment' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'interests', label: 'Interests' },
    { key: 'languages', label: 'Languages' },
  ];

  constructor(
    private route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly router: Router,
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
    private gaService: GAService
  ) {
    this.post = router.url.replace('/resume/', '');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email') || environment.mainEmail;
      this.fetchDataByEmailAndApply(email);
    });
  }

  fetchDataByEmailAndApply(email: string) {
    this.dataService.fetchDataByEmail(email).subscribe(data => {
      this.data = data;
      this.theme = this.data.theme.colors;
      this.applyTheme();
      this.cdRef.detectChanges();

      if (data.bots && data.bots.some(bot => bot.type === 'quotes')) {
        this.getQuote(email);
        this.isBotQuotes = true;
      }
    });
  }



  ngAfterViewInit() {
  }

  ngOnChanges() { }

  changeToMenu(menu: string) {
    this.post = menu;
  }

  getQuote(email: string) {
    const headers = {
      'Content-Type': 'application/json',
      'apiKey': environment.message_api_key
    };

    const options = {
      headers: new HttpHeaders(headers),
      params: new HttpParams().set('email', email)
    };

    const quoteURL = environment.functionURL + '/quote';
    this.http.post(quoteURL, {}, options).subscribe((response: any) => {
      if (response) {
        this.quote = response.choices[0].message.content;
        this.cdRef.detectChanges();

      }
    });
  }


  scrollToTop() {
    const content = document.getElementById('content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  }

  applyTheme() {
    if (this.theme && this.theme) {
      this.theme.forEach(color => {
        this.document.documentElement.style.setProperty(`--${color.key}`, color.value);
      });
      console.log('Applied Theme');
    } else {
      console.error('Theme or colors is undefined:', this.theme);
    }
  }



}
