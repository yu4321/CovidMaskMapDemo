import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerToolbarComponent } from './lower-toolbar.component';

describe('LowerToolbarComponent', () => {
  let component: LowerToolbarComponent;
  let fixture: ComponentFixture<LowerToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
