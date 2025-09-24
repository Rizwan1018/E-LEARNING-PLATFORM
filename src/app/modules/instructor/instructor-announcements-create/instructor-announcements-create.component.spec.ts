import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAnnouncementsCreateComponent } from './instructor-announcements-create.component';

describe('InstructorAnnouncementsCreateComponent', () => {
  let component: InstructorAnnouncementsCreateComponent;
  let fixture: ComponentFixture<InstructorAnnouncementsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorAnnouncementsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorAnnouncementsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
