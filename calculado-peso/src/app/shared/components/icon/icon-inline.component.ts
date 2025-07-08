// ===== 5. COMPONENTE DE ÍCONE INLINE (ALTERNATIVA MAIS SIMPLES) =====
// src/app/shared/components/icon/icon-inline.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconName } from '../../types/icon.types';

@Component({
  selector: 'app-icon-inline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="sizeW" 
      [attr.height]="sizeH" 
      [attr.viewBox]="viewBox"
      [class]="cssClass"
      [style.color]="color"
      fill="currentColor">
      <ng-container [ngSwitch]="name">
        <!-- Home -->
        <path *ngSwitchCase="'home'" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        
        <!-- Search -->
        <path *ngSwitchCase="'search'" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        
        <!-- User -->
        <path *ngSwitchCase="'user'" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        
        <!-- Menu -->
        <path *ngSwitchCase="'menu'" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        
        <!-- Close -->
        <path *ngSwitchCase="'close'" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        
        <!-- Plus -->
        <path *ngSwitchCase="'plus'" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        
        <!-- Star -->
        <path *ngSwitchCase="'star'" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        
        <!-- Heart -->
        <path *ngSwitchCase="'heart'" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        
        <!-- eco -->

        <!-- Adicione mais ícones aqui -->
        
        <!-- Fallback -->
        <path *ngSwitchDefault d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </ng-container>
    </svg>
  `
})
export class IconInlineComponent {
  @Input() name!: IconName;
  @Input() sizeW: number = 24;
  @Input() sizeH: number = 24;
  @Input() viewBox: string = '0 0 24 24';
  @Input() color?: string;
  @Input() cssClass: string = '';
}