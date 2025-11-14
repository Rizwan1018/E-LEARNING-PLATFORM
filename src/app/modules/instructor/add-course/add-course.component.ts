// src/app/modules/instructor/add-course/add-course.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { CatalogService } from '../../../services/catalog.service';
import { Course } from '../../../models/course';


@Component({
  selector: 'app-add-course',
  standalone:false,
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm!: FormGroup;
  message = '';
  courses: Course[] = [];
  editingCourseId: number | null = null;
  instructorId: number | any;
  selectedThumbnail: File | null = null;
  selectedVideo: File | null = null;
  selectedPrerequisite: File | null = null;




  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private catalog: CatalogService
  ) {}


  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      domain: ['', Validators.required],
      instructorId : [null],
      level: ['', Validators.required],
      durationHrs: [null],
      tags: [''],
      description: [''],
      thumbnail: [''],
      videoUrl: [''],
      prerequisite : ['']
    });


    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;


    if (user && user.role === 'INSTRUCTOR') {


      if (user.instructorId) {
        this.instructorId = Number(user.instructorId);
        this.courseForm.patchValue({ instructorId: this.instructorId });
        this.loadCourses(this.instructorId);
      } else {
        this.instructorId = user.id;
        this.courseForm.patchValue({instructorId: this.instructorId})
        this.loadCourses(this.instructorId);
      }
    } else {
      this.loadCourses();
    }
  }


  onThumbnailFileSelect(event:any, type: string){
      const file = event.target.files[0];
      if(file){
        this.selectedThumbnail = file;
        console.log("Thumbnail Selected", file.name)
      }
  }
  onVideoFileSelect(event:any, type: string){
      const file = event.target.files[0];
      if(file){
        this.selectedVideo = file;
        console.log("Video Selected", file.name)
      }
  }
  onPrerequisiteFileSelect(event:any, type: string){
      const file = event.target.files[0];
      if(file){
        this.selectedPrerequisite = file;
        console.log("Prerequisite Selected", file.name)
      }
  }


  loadCourses(instructorId?: number) {
    if (instructorId) {
      this.courseService.getCoursesByInstructor(instructorId).subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    } else {
      this.courseService.getCourses().subscribe({
        next: (data) => (this.courses = data),
        error: (err) => console.error(err)
      });
    }
  }

  OnSubmit() {
    console.log('submit called')
    console.log('FORM VALID',this.courseForm.valid)
    console.log('FORM VALUE',this.courseForm.value)


    if(!this.instructorId){
      const userRaw = localStorage.getItem('user');
      const user = userRaw?JSON.parse(userRaw) : null;
      this.instructorId = user?.instructorId || user?.id;
    }
    this.courseForm.patchValue({instructorId: this.instructorId})
   
    const fv = this.courseForm.value;
   
    const tagsArray: string[] = fv.tags
    ? fv.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
    : [];
    const finalInstructorId = this.instructorId ?? (fv.instructorId ? +fv.instructorId : undefined);
   
    const formData = new FormData();
    formData.append('title', fv.title)
    formData.append('domain', fv.domain)
    formData.append('level', fv.level)
    formData.append('durationHrs', fv.durationHrs)
    formData.append('tags', tagsArray.join(','));
    formData.append('description', fv.description)
    formData.append('instructorId', this.instructorId?.toString() || '')


      if(this.selectedThumbnail) formData.append('thumbnail', this.selectedThumbnail)
      if(this.selectedVideo) formData.append('video', this.selectedVideo)
      if(this.selectedPrerequisite) formData.append('prerequisite', this.selectedPrerequisite)


    if (this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, formData).subscribe({
        next: () => {
          this.message = ' Course updated successfully';
          this.courseForm.reset();
          this.editingCourseId = null;
          this.loadCourses(this.instructorId ?? undefined);
        },
        error: (err) => {
          console.error(err);
          this.message = ' Failed to update course';
        }
      });
      return;
    } 
      this.courseService.addCourse(formData).subscribe({
        next: () => {
          this.message = ' Course added successfully';
          this.courseForm.reset();
          this.loadCourses(this.instructorId ?? undefined);
        },
        error: (err) => {
          console.error(err);
          this.message = ' Failed to add course';
        }
      });
    }

  remove(courseId: number | string) {
    const id = Number(courseId);
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.message = '🗑 Course deleted successfully';
        this.loadCourses(this.instructorId ?? undefined);
      },
      error: (err) => {
        console.error(err);
        this.message = ' Failed to delete course';
        this.loadCourses(this.instructorId ?? undefined);

      }
    });
  }

  edit(course: Course) {
    this.editingCourseId = Number(course.id);
    this.courseForm.patchValue({
      title: course.title,
      instructorId: course.instructorId,
      domain: course.domain,
      level: course.level,
      durationHrs: course.durationHrs,
      tags: course.tags,
      description: course.description,
      price: course.price,
      rating: course.rating,
      studentsCount: course.studentsCount,
      // thumbnail: course.thumbnail,
      // videoUrl: course.videoUrl
    });
  }
}