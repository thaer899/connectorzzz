import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  skillId: string | null = null;
  facts: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.skillId = this.route.snapshot.paramMap.get('id');
    this.getFacts(this.skillId);
  }

  getFacts(topic: string | null): void {
    if (!topic) {
      console.error('ID is null');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'API_KEY': environment.message_api_key
    });

    const options = {
      headers,
      params: new HttpParams().set('email', environment.mainEmail)
    };

    const body = {
      recipientMessage: topic
    };

    const skillURL = environment.functionURL + 'skill';

    this.http.post<any>(skillURL, body, options).subscribe(
      (response) => {
        try {
          this.facts = response.choices[0].message.content.split('\n')
          console.log("Skill Facts Response:", this.facts);
        } catch (error) {
          console.error("Parsing error:", error);
        }
      },
      (error) => {
        console.error("HTTP Error:", error);
      }
    );
  }

  get skillDetailsAsArray(): boolean {
    return Array.isArray(this.facts);
  }
}