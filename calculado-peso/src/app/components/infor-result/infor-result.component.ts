import { Component, Input } from '@angular/core';
import { IconComponent } from "../../shared/components/icon/icon.component";
import { PdfService } from '../../services/pdf.service';
import { Transport } from '../../shared/types/transport';
import { LoadingComponent } from "../loading-component/loading-component.component";

@Component({
  selector: 'app-infor-result',
  imports: [IconComponent, LoadingComponent],
  templateUrl: './infor-result.component.html',
  styleUrl: './infor-result.component.css'
})
export class InforResultComponent {

  @Input() data!: Transport;

  Caminhaoloading = false; 

  constructor(private pdfService: PdfService) {}

  get formattedData(): Transport {
    return {
      ...this.data,
      rel_rodoviario: Number(this.data.rel_rodoviario.toFixed(2)),
      rel_porta_porto: Number(this.data.rel_porta_porto.toFixed(2)),
      rel_ativ_porto: Number(this.data.rel_ativ_porto.toFixed(2)),
      rel_cabotagem: Number(this.data.rel_cabotagem.toFixed(2)),
      rel_porto_porta: Number(this.data.rel_porto_porta.toFixed(2)),
      total_rodoviario: Number(this.data.total_rodoviario.toFixed(2)),
      total_mercosul: Number(this.data.total_mercosul.toFixed(2)),
      economia: Number(this.data.economia.toFixed(2)),
      arvores: Number(this.data.arvores.toFixed(2)),
      gelo: Number(this.data.gelo.toFixed(2)),
      caminhoes: Number(this.data.caminhoes.toFixed(2)),
      credito_carbono: Number(this.data.credito_carbono.toFixed(2)),
      quantidade:this.data.quantidade,
      formato: this.data.formato,
      carregamento: this.data.carregamento,
      origem: this.data.origem,
      destino: this.data.destino,
      porto_origem: this.data.porto_origem,
      porto_destino: this.data.porto_destino,
      transit_time: this.data.transit_time,
    };
  }

  async generatePdf() {
    const dataPdf = {
      rel_rodoviario: Number(this.data.rel_rodoviario.toFixed(2)),
      rel_porta_porto: Number(this.data.rel_porta_porto.toFixed(2)),
      rel_ativ_porto: Number(this.data.rel_ativ_porto.toFixed(2)),
      rel_cabotagem: Number(this.data.rel_cabotagem.toFixed(2)),
      rel_porto_porta: Number(this.data.rel_porto_porta.toFixed(2)),
      total_rodoviario: Number(this.data.total_rodoviario.toFixed(2)),
      total_mercosul: Number(this.data.total_mercosul.toFixed(2)),
      economia: Number(this.data.economia.toFixed(2)),
      arvores: Number(this.data.arvores.toFixed(2)),
      gelo: Number(this.data.gelo.toFixed(2)),
      caminhoes: Number(this.data.caminhoes.toFixed(2)),
      credito_carbono: Number(this.data.credito_carbono.toFixed(2)),
      quantidade:this.data.quantidade,
      formato: this.data.formato,
      carregamento: this.data.carregamento,
      origem: this.data.origem,
      destino: this.data.destino,
      porto_origem: this.data.porto_origem,
      porto_destino: this.data.porto_destino,
      transit_time: this.data.transit_time,
    };
    
    try {
      this.Caminhaoloading = true;
      await this.pdfService.generatePdf('emission-comparison', dataPdf, 'relatorio-co2.pdf');
      this.Caminhaoloading = false;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
}
