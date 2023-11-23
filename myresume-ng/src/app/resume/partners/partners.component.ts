import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent {

  public data: any;


  constructor(
    private readonly dataService: DataService
  ) {
  }

  ngOnInit() {

    this.getUsersFirebase();
  }

  getUsersFirebase() {
    this.dataService.fetchUsers().subscribe(data => {
      this.data = data;
    });
  }


}
