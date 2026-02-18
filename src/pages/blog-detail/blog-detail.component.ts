
import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { BlogPost } from '../../services/supabase.models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseService);

  post = signal<BlogPost | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    } else {
      this.error.set('Post ID not found.');
      this.loading.set(false);
    }
  }

  async loadPost(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.post.set(await this.supabaseService.getBlogPost(id));
    } catch (e) {
      this.error.set('Failed to load the blog post.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
