import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit {
  public employment: any

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private dataService: DataService, private readonly http: HttpClient) { }


  ngOnInit() {
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
