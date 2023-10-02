import { Component, OnInit, OnChanges } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnChanges {
  color = 'defaultdark'
  showSettings = false
  showMinisidebar = false
  showDarktheme = false

  constructor(public route: ActivatedRoute, public router: Router) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    // this.page = this.route.snapshot._routerState.url;
  }
}
