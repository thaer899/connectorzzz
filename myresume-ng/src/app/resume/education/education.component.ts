import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GAService } from 'src/app/services/ga.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  public education: any


  dataFromParent: any;
  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private readonly http: HttpClient,
    private titleService: Title,
    private route: ActivatedRoute,
    private gaService: GAService
  ) { }


  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);
        this.gaService.trackPageView(data.title);
      }
    });
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.education = data.education; // Populate the employment property
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
}
