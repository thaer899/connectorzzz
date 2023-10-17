import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisualComponent } from './site-visual.component';

describe('SiteVisualComponent', () => {
  let component: SiteVisualComponent;
  let fixture: ComponentFixture<SiteVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteVisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
