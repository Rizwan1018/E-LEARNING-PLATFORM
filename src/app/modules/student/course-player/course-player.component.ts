// src/app/modules/student/course-player/course-player.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-course-player',
  standalone:false,
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {
  course?: Course;

  constructor(private route: ActivatedRoute, private catalog: CatalogService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('courseId')!;
    if (id) {
      this.catalog.getCourse(id).subscribe(c => (this.course = c));
    }
  }
}