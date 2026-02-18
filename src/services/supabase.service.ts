
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Project, Experience, BlogPost, ContactMessage } from './supabase.models';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // In a non-applet environment, you would use imports. Here we rely on the CDN script.
    const supabaseGlobal = (window as any).supabase;
    if (!supabaseGlobal) {
        throw new Error('Supabase client not found. Make sure the script is loaded in index.html');
    }
    this.supabase = supabaseGlobal.createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  // Projects
  async getProjects() {
    const { data, error } = await this.supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Project[];
  }

  async addProject(project: Project) {
    const { data, error } = await this.supabase.from('projects').insert(project).select();
    if (error) throw error;
    return data[0] as Project;
  }
  
  async deleteProject(id: number) {
    const { error } = await this.supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }

  // Experience
  async getExperience() {
    const { data, error } = await this.supabase.from('experience').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Experience[];
  }

  async addExperience(experience: Experience) {
    const { data, error } = await this.supabase.from('experience').insert(experience).select();
    if (error) throw error;
    return data[0] as Experience;
  }

  async deleteExperience(id: number) {
    const { error } = await this.supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  }
  
  // Blog
  async getBlogPosts() {
    const { data, error } = await this.supabase.from('blog').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as BlogPost[];
  }

  async getBlogPost(id: string) {
    const { data, error } = await this.supabase.from('blog').select('*').eq('id', id).single();
    if (error) throw error;
    return data as BlogPost;
  }

  async addBlogPost(post: BlogPost) {
    const { data, error } = await this.supabase.from('blog').insert(post).select();
    if (error) throw error;
    return data[0] as BlogPost;
  }

  async deleteBlogPost(id: number) {
    const { error } = await this.supabase.from('blog').delete().eq('id', id);
    if (error) throw error;
  }

  // Contact
  async getContactMessages() {
      const { data, error } = await this.supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
  }
  
  async addContactMessage(message: ContactMessage) {
    const { data, error } = await this.supabase.from('messages').insert(message);
    if (error) throw error;
    return data;
  }

  // Storage
  async uploadFile(bucket: string, file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    return data.path;
  }

  getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async getResumeUrl() {
    const { data, error } = await this.supabase.storage.from('resume').list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
    if (error || !data || data.length === 0) {
      console.error('Error fetching resume or no resume found:', error);
      return null;
    }
    return this.getPublicUrl('resume', data[0].name);
  }
}
