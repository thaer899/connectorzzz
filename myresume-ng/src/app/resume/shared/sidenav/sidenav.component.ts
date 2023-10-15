import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  public post: any;
  public resume: any;
  public email: any;
  public mainEmail: string = environment.mainEmail;

  public menuItems = [
    { key: 'employment', label: 'Employment' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'interests', label: 'Interests' },
    { key: 'languages', label: 'Languages' },
    { key: 'blogs', label: 'Blog' }
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');

      if (email) {
        this.email = email;
        this.dataService.fetchDataByEmail(email).subscribe(data => {
          this.resume = data.resume;
          console.log("Sidenav: Resume Data from DataService:", this.resume);
        });
      } else {
        this.dataService.fetchData().subscribe(data => {
          this.resume = data.resume;
          console.log("Sidenav: Resume Data from DataService:", this.resume);

        });
      }
      console.log('email', email);
      console.log('this.email', this.email);
      console.log('this.mainEmail', this.mainEmail);
    });


  }

  changeToMenu(menu: string): void {
    this.post = menu;
  }


}
