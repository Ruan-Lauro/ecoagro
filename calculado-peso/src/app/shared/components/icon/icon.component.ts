import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../../services/icon.service'; 
import { IconName } from '../../types/icon.types';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="icon-container"
      [class]="cssClass"
      [style.width.px]="sizeW"
      [style.height.px]="sizeH"
      [style.color]="color"
      [innerHTML]="iconContent">
    </div>
  `,
  styles: [`
    .icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .icon-container :global(svg) {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    
    .icon-container.clickable {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    
    .icon-container.clickable:hover {
      opacity: 0.7;
    }
  `]
})
export class IconComponent implements OnInit, OnDestroy {
  @Input() name!: IconName;
  @Input() sizeW: number = 24;
  @Input() sizeH: number = 24;
  @Input() color?: string;
  @Input() cssClass: string = '';
  @Input() clickable: boolean = false;

  iconContent: SafeHtml = '';
  private destroy$ = new Subject<void>();

  constructor(private iconService: IconService) {}

  ngOnInit(): void {
    if (!this.name) {
      console.warn('Nome do ícone é obrigatório');
      return;
    }

    if (this.clickable) {
      this.cssClass += ' clickable';
    }

    this.iconService.loadIcon(this.name)
      .pipe(takeUntil(this.destroy$))
      .subscribe(content => {
        this.iconContent = content;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}