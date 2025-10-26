import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css'
})
export class LogoComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showText: boolean = true;
  @Input() altText: string = 'Lizvi EIRL Logo';

  onImageError(): void {
    console.error('Error loading Lizvi logo image');
  }

  onImageLoad(): void {
    console.log('Lizvi logo loaded successfully');
  }
}
