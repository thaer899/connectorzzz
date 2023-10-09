import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public resume: any

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private dataService: DataService, private readonly http: HttpClient) { }


  ngOnInit() {
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.resume = data.resume.about;
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
