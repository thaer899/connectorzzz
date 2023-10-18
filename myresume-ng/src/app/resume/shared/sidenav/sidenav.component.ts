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
  public name_abr: string;
  public mainEmail: string = environment.mainEmail;
  public isBotMessage: boolean = false;

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


      if (!email) {
        this.dataService.fetchData().subscribe(data => {
          this.resume = data.resume;
          if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
            this.isBotMessage = true;
          }
        });
      } else {
        this.email = email;
        this.dataService.fetchDataByEmail(email).subscribe(data => {
          this.resume = data.resume;
          this.name_abr = this.resume.firstName.charAt(0) + this.resume.lastName.charAt(0);
          if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
            this.isBotMessage = true;
          }
        });
      }
    });


  }

  changeToMenu(menu: string): void {
    this.post = menu;
  }


}
