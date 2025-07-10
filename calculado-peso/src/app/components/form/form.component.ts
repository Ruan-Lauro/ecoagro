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

    error: string = '';

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

    dataApi: Transport | undefined ;

    onSubmit() {
      if (this.form.valid) {

        const dadosForm = this.form.value;

        if(dadosForm.qtdTEU === null || dadosForm.qtdTEU === undefined || dadosForm.qtdTEU === '' || isNaN(Number(dadosForm.qtdTEU)) || Number(dadosForm.qtdTEU) <= 0){
          console.warn('Quantidade de TEUs inválida');
          this.error = 'Quantidade de TEUs inválida';
          return;
        }

        this.myservice.criarItem({
          origem: dadosForm.cidade1!,
          destino: dadosForm.cidade2!,
          formatoDeContainers: dadosForm.container === "Dry"?'dry':'reefer',
          tipoContainers: dadosForm.typeContainer!,
          carregamento: dadosForm.load === "TEU's"?"TEU":"carregamento",
          quantidadeTEUs: Number(dadosForm.qtdTEU)
        }).subscribe({
          next: (res) => {
            this.error = '';
            this.dataApi = res ;
            if(this.dataApi?.arvores){
              this.router.navigate(['/result'], { state: { data: this.dataApi } });
            }else{
              console.error('Dados com problemas');
              this.error = 'Dados com problemas';
            }
          },
          error: (erro) => {
            console.error('Erro ao salvar dados:', erro);
            this.error = erro?.error.error || 'Erro desconhecido ao salvar dados.';
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

  onlyNumbers(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.form.get('qtdTEU')?.setValue(input.value);
  }

}
