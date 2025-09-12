import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent {

  stats = [
    { title: 'Total Students', value: '27,580', subtext: 'Across 3 courses', bgClass: 'bg-primary text-white' },
    { title: 'Total Earnings', value: '$24,450.84', subtext: '+12.5% from last month', bgClass: 'bg-success text-white' },
    { title: 'Average Rating', value: '4.8', subtext: 'From student reviews', bgClass: 'bg-light' },
    { title: 'Course Hours', value: '92', subtext: '89.2% completion rate', bgClass: 'bg-light' }
  ];


  // Use the data from services 
  assignments = [
    {
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive website using HTML, CSS, and JavaScript',
      dueDate: '2024-01-15',
      submissions: 342,
      avgScore: 87.5
    },
    {
      title: 'Implement Async/Await Pattern',
      description: 'Convert callback-based code to modern async/await syntax',
      dueDate: '2024-01-20',
      submissions: 156,
      avgScore: 92.3
    }
  ];

  courses = [
    {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and build apps',
      hours: 40,
      students: 15420,
      rating: 4.8,
      level: 'Beginner'
    },
    {
      title: 'Advanced JavaScript Concepts',
      description: 'Closures, prototypes, async/await, ES6+ features',
      hours: 20,
      students: 8920,
      rating: 4.7,
      level: 'Advanced'
    },
    {
      title: 'Node.js Backend Development',
      description: 'Backend apps with Express, MongoDB, Authentication',
      hours: 32,
      students: 3240,
      rating: 4.9,
      level: 'Intermediate'
    }
  ];
}



