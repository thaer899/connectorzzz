import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { browser, by, element } from 'protractor';

describe('AppComponent', () => {
  let fixture;
  let app;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    tick();
  }));

  it('should create the app', () => {
    console.log('Step 1: AppComponent created');
    expect(app).toBeTruthy();
  });

  it('should have as title \'app\'', () => {
    console.log('Step 2: AppComponent created');
    expect(app.title).toEqual('app');
  });

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    console.log('Step 3: AppComponent created');
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  });
});
