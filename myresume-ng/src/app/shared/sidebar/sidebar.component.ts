import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public references: any
  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/data/references.json').subscribe((data: any) => {
      this.references = data.references
    })
    document.getElementById('inner-content')?.scrollIntoView()
  }
}
