import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Any initialization logic can go here if needed
  }
}