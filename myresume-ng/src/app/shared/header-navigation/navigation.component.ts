import { Component, AfterViewInit } from '@angular/core'
import { ModalModule } from 'ngx-bootstrap/modal'
declare let $: any

@Component({
  selector: 'ap-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  name: string
  constructor(private readonly modalService: ModalModule) {

  }

  ngAfterViewInit() {
    const set = function () {
      const width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width
      const topOffset = 0
      if (width < 1170) {
        $('#main-wrapper').addClass('mini-sidebar')
      } else {
        $('#main-wrapper').removeClass('mini-sidebar')
      }
    }
    $(window).ready(set)
    $(window).on('resize', set)

    $('.search-box a, .search-box .app-search .srh-btn').on('click', function () {
      $('.app-search').toggle(200)
    })

    $('body').trigger('resize')
  }
}
