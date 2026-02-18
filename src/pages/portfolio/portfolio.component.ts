
import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { Project, Experience } from '../../services/supabase.models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  
  projects = signal<Project[]>([]);
  experience = signal<Experience[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<'projects' | 'experience'>('projects');

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [projects, experience] = await Promise.all([
        this.supabaseService.getProjects(),
        this.supabaseService.getExperience()
      ]);
      this.projects.set(projects);
      this.experience.set(experience);
    } catch (e) {
      this.error.set('Failed to load portfolio data. Please try again later.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  selectTab(tab: 'projects' | 'experience') {
    this.activeTab.set(tab);
  }
}
