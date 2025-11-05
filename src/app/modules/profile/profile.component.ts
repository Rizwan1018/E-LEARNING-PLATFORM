import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone:false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {
    fullName: '',
    headline: '',
    bio: ''
  };

  userId!: number;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      // console.log("User datata",stored)
      const u = JSON.parse(stored);
      this.user.fullName = u.fullName;
      this.userId = u.id;
      this.loadData();
    }
  }

  loadData() {
    this.authService.getUserProfile(this.userId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.log(err)
    });
  }

 save() {
  const body = {
    headline: this.user.headline,
    bio: this.user.bio
  };

  this.authService.updateUserProfile(this.user.id, body).subscribe({
    next: () => alert("✅ Profile updated successfully!"),
    error: err => console.error(err)
  });
}

}
