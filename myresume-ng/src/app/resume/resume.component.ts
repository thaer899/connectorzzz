import { HttpClient } from '@angular/common/http'
import { Component, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  providers: []
})
export class ResumeComponent implements OnInit, OnChanges {
  public post: any
  public data: any
  public resume: any
  constructor(private readonly dataService: DataService, private readonly router: Router, private readonly http: HttpClient) {
    this.post = router.url.replace('/resume/', '')

  }

  ngOnInit() {
    // add code here if needed
    this.dataService.fetchData().subscribe(data => {
      console.log("Data from DataService:", data);
      this.resume = data.resume;
    });

  }

  ngOnChanges() {
    // add code here if needed
  }

  changeToMenu(menu: string) {
    this.post = menu
  }

  scrollToTop() {
    const content = document.getElementById('content')
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
