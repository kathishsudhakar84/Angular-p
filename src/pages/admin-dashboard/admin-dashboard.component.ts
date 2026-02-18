
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Project, Experience, BlogPost, ContactMessage } from '../../services/supabase.models';

type AdminTab = 'projects' | 'experience' | 'blog' | 'messages' | 'resume';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);

  activeTab = signal<AdminTab>('projects');
  
  // Data signals
  projects = signal<Project[]>([]);
  experiences = signal<Experience[]>([]);
  blogPosts = signal<BlogPost[]>([]);
  messages = signal<ContactMessage[]>([]);
  resumeUrl = signal<string | null>(null);

  // Form signals
  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    project_url: ['', Validators.required],
    tags: [''],
    image: [null]
  });

  experienceForm = this.fb.group({
    role: ['', Validators.required],
    company: ['', Validators.required],
    period: ['', Validators.required],
    description: ['', Validators.required]
  });

  blogForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    author: ['Admin', Validators.required],
    image: [null]
  });

  resumeFile = signal<File | null>(null);

  ngOnInit() {
    this.loadAllData();
  }

  async loadAllData() {
    this.projects.set(await this.supabaseService.getProjects());
    this.experiences.set(await this.supabaseService.getExperience());
    this.blogPosts.set(await this.supabaseService.getBlogPosts());
    this.messages.set(await this.supabaseService.getContactMessages());
    this.resumeUrl.set(await this.supabaseService.getResumeUrl());
  }

  selectTab(tab: AdminTab) {
    this.activeTab.set(tab);
  }

  onFileChange(event: Event, formControlName: string, formGroup: 'projectForm' | 'blogForm') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this[formGroup].patchValue({ [formControlName]: file });
    }
  }
  
  onResumeFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.resumeFile.set(input.files[0]);
    }
  }

  async handleAddProject() {
    if (this.projectForm.invalid) return;
    const formValue = this.projectForm.value;
    const imageFile = formValue.image as unknown as File;
    
    let imageUrl = '';
    if (imageFile) {
        const path = await this.supabaseService.uploadFile('project-images', imageFile);
        imageUrl = this.supabaseService.getPublicUrl('project-images', path);
    }
    
    const newProject: Project = {
      title: formValue.title!,
      description: formValue.description!,
      project_url: formValue.project_url!,
      tags: formValue.tags!.split(',').map(tag => tag.trim()),
      image_url: imageUrl
    };
    await this.supabaseService.addProject(newProject);
    this.projectForm.reset();
    this.projects.set(await this.supabaseService.getProjects());
  }
  
  async deleteItem(type: 'project' | 'experience' | 'blog', id?: number) {
    if (!id || !confirm('Are you sure you want to delete this item?')) return;
    if (type === 'project') {
        await this.supabaseService.deleteProject(id);
        this.projects.update(p => p.filter(item => item.id !== id));
    } else if (type === 'experience') {
        await this.supabaseService.deleteExperience(id);
        this.experiences.update(e => e.filter(item => item.id !== id));
    } else if (type === 'blog') {
        await this.supabaseService.deleteBlogPost(id);
        this.blogPosts.update(b => b.filter(item => item.id !== id));
    }
  }

  async handleAddExperience() {
    if (this.experienceForm.invalid) return;
    await this.supabaseService.addExperience(this.experienceForm.value as Experience);
    this.experienceForm.reset();
    this.experiences.set(await this.supabaseService.getExperience());
  }

  async handleAddBlogPost() {
    if (this.blogForm.invalid) return;
    const formValue = this.blogForm.value;
    const imageFile = formValue.image as unknown as File;

    let imageUrl;
    if (imageFile) {
      const path = await this.supabaseService.uploadFile('blog-images', imageFile);
      imageUrl = this.supabaseService.getPublicUrl('blog-images', path);
    }

    const newPost: BlogPost = {
      title: formValue.title!,
      content: formValue.content!,
      author: formValue.author!,
      image_url: imageUrl
    };
    await this.supabaseService.addBlogPost(newPost);
    this.blogForm.reset();
    this.blogPosts.set(await this.supabaseService.getBlogPosts());
  }

  async handleUploadResume() {
    const file = this.resumeFile();
    if (!file) return;
    await this.supabaseService.uploadFile('resume', file);
    alert('Resume uploaded successfully!');
    this.resumeUrl.set(await this.supabaseService.getResumeUrl());
    this.resumeFile.set(null);
  }
}
