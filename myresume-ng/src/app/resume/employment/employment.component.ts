import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit {
  public employment: any

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, private readonly http: HttpClient) { }


  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);;
      }
    });
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.employment = data.employment;
      const innerContent = document.getElementById('inner-content')
      if (innerContent) {
        innerContent.scrollIntoView()
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
