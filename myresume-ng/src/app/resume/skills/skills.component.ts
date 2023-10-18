import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { environment } from 'src/environments/environment'

interface Skill {
  name: string
  level: number
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  public skills: Skill[] = []
  public email: any;

  dataFromParent: any;

  constructor(
    private dataService: DataService,
    private readonly http: HttpClient,
    private titleService: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data.title) {
        this.titleService.setTitle(environment.title + " - " + data.title);;
      }
    });
    this.route.parent!.paramMap.subscribe(params => {
      this.email = params.get('email');

      this.dataService.fetchData().subscribe(data => {
        this.skills = data.skills;
      });

    });

    const innerContent = document.getElementById('inner-content')
    if (innerContent) {
      innerContent.scrollIntoView()
    }
  }
}
