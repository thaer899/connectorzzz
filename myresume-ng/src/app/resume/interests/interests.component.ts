import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  public interests: any

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private router: Router, private dataService: DataService, private readonly http: HttpClient) { }


  ngOnInit() {
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.interests = data.interests;
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