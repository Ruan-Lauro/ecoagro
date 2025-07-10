import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading-component',
  imports: [],
  templateUrl: './loading-component.component.html',
  styleUrl: './loading-component.component.css'
})

export class LoadingComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean = true;
  
  currentPhase: 'truck' | 'boat' = 'truck';
  truckPosition: number = 0;
  boatPosition: number = 0;
  isTransitioning: boolean = false;
  progressWidth: number = 0;
  
  private intervalId: any;
  private phaseTimer: any;
  
  ngOnInit() {
    this.startAnimation();
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
    }
  }
  
  private startAnimation() {
    // Inicia o ciclo de animação
    this.animateCurrentPhase();
    
    // Alterna entre fases a cada 4 segundos
    this.phaseTimer = setInterval(() => {
      if (this.isLoading) {
        this.switchPhase();
      }
    }, 4000);
  }
  
  private animateCurrentPhase() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      if (!this.isLoading) {
        clearInterval(this.intervalId);
        return;
      }
      
      if (this.currentPhase === 'truck') {
        this.truckPosition += 2;
        if (this.truckPosition > 700) {
          this.truckPosition = 10;
        }
      } else {
        this.boatPosition += 3;
        if (this.boatPosition > 500) {
          this.boatPosition = 30;
        }
      }
      
      // Atualiza progresso
      this.progressWidth = (this.progressWidth + 2) % 100;
    }, 100);
  }
  
  private switchPhase() {
    if (!this.isLoading) return;
    
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentPhase = this.currentPhase === 'truck' ? 'boat' : 'truck';
      this.resetPositions();
      this.isTransitioning = false;
      this.animateCurrentPhase();
    }, 1000);
  }
  
  private resetPositions() {
    this.truckPosition = -10;
    this.boatPosition = -15;
    this.progressWidth = 0;
  }
}