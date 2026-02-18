
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);

  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  async onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.status.set('sending');
    this.errorMessage.set(null);

    try {
      const formValue = this.contactForm.value;
      await this.supabaseService.addContactMessage({
        name: formValue.name!,
        email: formValue.email!,
        message: formValue.message!
      });
      this.status.set('success');
      this.contactForm.reset();
    } catch (error) {
      this.status.set('error');
      this.errorMessage.set('An error occurred. Please try again.');
      console.error(error);
    }
  }
}
