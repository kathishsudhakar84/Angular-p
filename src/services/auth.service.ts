
import { Injectable, signal, inject } from '@angular/core';
import { SupabaseClient, User, AuthSession } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Note: In a real app, this should be a proper service injection.
// For this applet, we create the client here.
const supabase = (window as any).supabase.createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase: SupabaseClient = supabase;
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
    this.loadSession();
  }
  
  private async loadSession() {
    const { data } = await this.supabase.auth.getSession();
    this.currentUser.set(data.session?.user ?? null);
  }

  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    this.currentUser.set(data.user);
    return data;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.currentUser.set(null);
  }
}
