import { Component } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  ngOnInit() {
    AOS.init();
    
  }

}
