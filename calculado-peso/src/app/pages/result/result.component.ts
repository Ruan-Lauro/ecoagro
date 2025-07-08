import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InforResultComponent } from "../../components/infor-result/infor-result.component";
import { Router } from '@angular/router';
import { Transport } from '../../shared/types/transport';

@Component({
  selector: 'app-result',
  imports: [HeaderComponent, FooterComponent, InforResultComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  data: Transport;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'];
    console.log('Dados recebidos:', this.data);
  }
}
