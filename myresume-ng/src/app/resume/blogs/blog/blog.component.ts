import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  public blog: any
  public blogs: any
  public blogId: string | null = null;

  dataFromParent: any;
  private subscription: Subscription;

  constructor(private dataService: DataService, private route: ActivatedRoute, private readonly http: HttpClient) { }


  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.dataService.fetchData().subscribe(data => {
      this.dataFromParent = data;
      this.blogs = data.blog;
      this.blog = this.getBlogByTitle(this.blogId);
      console.log(this.blogs)

    });
    const innerContent = document.getElementById('inner-content')
    if (innerContent) {
      innerContent.scrollIntoView()
    }

  }

  getBlogByTitle(title: string | null) {
    if (!title) {
      console.error('Title is null');
      return;
    }

    if (this.blogs) {
      const blog = this.blogs.find(blog => blog.title === title);

      if (!blog) {
        console.error('No blog found with title:', title);
        return;
      }

      console.log(blog);
      return blog;
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();

  }

}
