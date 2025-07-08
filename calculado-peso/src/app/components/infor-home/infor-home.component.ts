import { Component } from '@angular/core';
import { FormComponent } from "../form/form.component";
import { MyApiService } from '../../services/my-api.service';

@Component({
  selector: 'app-infor-home',
  imports: [FormComponent],
  templateUrl: './infor-home.component.html',
  styleUrl: './infor-home.component.css'
})
export class InforHomeComponent {

  constructor(private myservice: MyApiService) { }

  onFormValueReceived(value: any) {
    const res = {
      origem: value.cidade1,
      destino: value.cidade2,
      formatoDeContainers: value.container,
      tipoContainers: value.typeContainer,
      carregamento: value.load,
      quantidadeTEUs: value.qtdTEU
    }

    console.log('Objeto que será enviado ao backend:', res);
    
    this.myservice.criarItem(res).subscribe({
      next: (res) => {
        console.log('Dados recebidos:', res);
      },
      error: (erro) => {
        console.error('Erro ao carregar dados:', erro);
      }
    });
  }

}
