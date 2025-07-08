import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../shared/components/icon/icon.component";

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './input-select.component.html',
})
export class InputSelectComponent implements OnInit {
  @Input() paramOne: string = '';
  @Input() paramTwo: string = '';
  @Input() titleText: string = '';
  @Input() listParam: any = [];
  @Input() secondForm: boolean = false;
  @Input() widthT: string = '';

  cidadeControl = new FormControl('');
  showDropdown = false;
  isTyping = false;
  private blurTimeout: any;

  @Output() cidadeSelecionada = new EventEmitter<string>();

  ngOnInit() {
    this.cidadeControl.valueChanges.subscribe((value) => {
      const termo = value?.toLowerCase() || '';
      
      if (this.isTyping && termo) {
        this.showDropdown = true;
      }

      else if (!termo && !this.showDropdown) {
        this.showDropdown = false;
      }
    });
  }

  get cidadesFiltradas() {
    const termo = this.cidadeControl.value?.toLowerCase() || '';
    
    if (!this.secondForm) {
      return this.listParam.filter((c: any) =>
        `${c[this.paramOne]} - ${c[this.paramTwo]}`.toLowerCase().includes(termo)
      );
    } else {
      return this.listParam.filter((c: any) =>
        `${c[this.paramOne]}`.toLowerCase().includes(termo)
      );
    }
  }

  onInputFocus() {
    this.isTyping = true;

    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
    
    if (this.cidadeControl.value || this.cidadesFiltradas.length > 0) {
      this.showDropdown = true;
    }
  }

  onInputBlur() {
    this.blurTimeout = setTimeout(() => {
      this.showDropdown = false;
      this.isTyping = false;
    }, 200);
  }

  toggleOptions() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
    
    this.showDropdown = !this.showDropdown;
    
    if (this.showDropdown) {
      this.isTyping = true;
    }
  }

  selecionarCidade(cidade: any) {
    const valor = this.secondForm 
      ? `${cidade[this.paramOne]}` 
      : `${cidade[this.paramOne]} - ${cidade[this.paramTwo]}`;
    
    this.cidadeControl.setValue(valor);
    this.showDropdown = false;
    this.isTyping = false;
    
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
    
    this.cidadeSelecionada.emit(valor);
  }

  ngOnDestroy() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }
}