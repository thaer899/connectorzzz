import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { GAService } from 'src/app/services/ga.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  public interests: any
  public email: any;

  dataFromParent: any;

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
    this.route.parent!.paramMap.subscribe(params => {
      this.email = params.get('email');

      this.dataService.fetchData().subscribe(data => {
        this.interests = data.interests;
      });

    });

    const innerContent = document.getElementById('inner-content')
    if (innerContent) {
      innerContent.scrollIntoView()
    }
  }

}