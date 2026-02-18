
import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { BlogPost } from '../../services/supabase.models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  posts = signal<BlogPost[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

  async loadPosts() {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.posts.set(await this.supabaseService.getBlogPosts());
    } catch (e) {
      this.error.set('Failed to load blog posts.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
