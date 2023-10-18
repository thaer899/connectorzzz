import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  public languages: any


  dataFromParent: any;
  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private readonly http: HttpClient,
    private titleService: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);;
      }
    });
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.languages = data.languages; // Populate the employment property
    });
    const innerContent = document.getElementById('inner-content')
    if (innerContent) {
      innerContent.scrollIntoView()
    }
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();

  }

  getDots(proficiency: string): string[] {
    const totalDots = 10;
    let blackDotsCount;
    switch (proficiency) {
      case 'Basic':
        blackDotsCount = 2;
        break;
      case 'Native':
        blackDotsCount = 9;
        break;
      default:
        blackDotsCount = 0;
    }
    const dots = Array(blackDotsCount).fill('black').concat(Array(totalDots - blackDotsCount).fill(''));
    return dots;
  }


}
