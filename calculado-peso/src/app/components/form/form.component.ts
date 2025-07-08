import { Component } from '@angular/core';
import {  FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSelectComponent } from "../input-select/input-select.component";
import { IconComponent } from "../../shared/components/icon/icon.component";
import { MyApiService } from '../../services/my-api.service';
import { Transport } from '../../shared/types/transport';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, InputSelectComponent, IconComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent  {
  
    [x: string]: any;

    constructor(private myservice: MyApiService, private router: Router) { }

    form = new FormGroup({
      cidade1: new FormControl(''),
      cidade2: new FormControl(''),
      container: new FormControl(''),
      typeContainer: new FormControl(''),
      load: new FormControl(''),
      qtdTEU: new FormControl(''),
    });

    cidadeSelecionada1 = '';
    cidadeSelecionada2 = '';
    containerSelecionado = '';
    typeContainerSelecionado = '';
    loadSelecionado = '';
    qtdTEUSelecionado = '';

    dataApi: Transport | undefined;

    onSubmit() {
      if (this.form.valid) {

        const dadosForm = this.form.value;

        this.myservice.criarItem({
          origem: dadosForm.cidade1!,
          destino: dadosForm.cidade2!,
          formatoDeContainers: dadosForm.container === "Dry"?'dry':'reefer',
          tipoContainers: dadosForm.typeContainer!,
          carregamento: dadosForm.load === "TEU's"?"TEU":"carregamento",
          quantidadeTEUs: Number(dadosForm.qtdTEU)
        }).subscribe({
          next: (res) => {
            console.log('Dados salvos com sucesso:', res);
            this.dataApi = res;
            if(this.dataApi?.arvores){
              this.router.navigate(['/result'], { state: { data: this.dataApi } });
            }else{
              console.error('Dados com problemas');
            }
          },
          error: (erro) => {
            console.error('Erro ao salvar dados:', erro);
          }
        });
      } else {
        console.warn('Formulário inválido');
      }
    }


    cidades: any[] = [];

    ngOnInit(): void {
    this.myservice.getDados().subscribe({
      next: (res) => {
        this.cidades = res;
        console.log('Dados recebidos:', this.cidades);
      },
      error: (erro) => {
        console.error('Erro ao carregar dados:', erro);
      }
    });
  }
}
