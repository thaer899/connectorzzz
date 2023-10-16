import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BlogsComponent {

  public blogs: any
  public isDetail = false;

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private dataService: DataService, private readonly http: HttpClient) { }


  ngOnInit() {
    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.blogs = data.blog;
      console.log(this.blogs)
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

  detailedView() {
    this.isDetail = !this.isDetail;
  }

}
