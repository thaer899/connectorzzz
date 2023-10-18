import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GAService } from 'src/app/services/ga.service';
import { environment } from 'src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']

})
export class BlogsComponent {

  public blogs: any = [];
  public isDetail = false;
  public email: any;

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

    this.route.parent!.paramMap.subscribe(params => {
      this.email = params.get('email');

      this.dataService.fetchData().subscribe(data => {
        this.blogs = data.blog;
      });

    });

    const innerContent = document.getElementById('inner-content')
    if (innerContent) {
      innerContent.scrollIntoView()
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }


  detailedView() {
    this.isDetail = !this.isDetail;
  }

}
