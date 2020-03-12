import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperToolbarComponent } from './upper-toolbar.component';

describe('UpperToolbarComponent', () => {
  let component: UpperToolbarComponent;
  let fixture: ComponentFixture<UpperToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
