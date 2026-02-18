
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleBackgroundComponent } from '../../components/particle-background/particle-background.component';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ParticleBackgroundComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  resumeUrl = signal<string | null>(null);

  ngOnInit() {
    this.loadResume();
  }

  async loadResume() {
    try {
      const url = await this.supabaseService.getResumeUrl();
      this.resumeUrl.set(url);
    } catch (error) {
      console.error('Failed to load resume URL:', error);
    }
  }
}
