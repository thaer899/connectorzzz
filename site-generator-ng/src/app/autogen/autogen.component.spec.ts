import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutogenComponent } from './autogen.component';

describe('AutogenComponent', () => {
  let component: AutogenComponent;
  let fixture: ComponentFixture<AutogenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutogenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
