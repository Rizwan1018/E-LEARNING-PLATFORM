import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnrollmentsComponent } from './view-enrollments.component';

describe('ViewEnrollmentsComponent', () => {
  let component: ViewEnrollmentsComponent;
  let fixture: ComponentFixture<ViewEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEnrollmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
