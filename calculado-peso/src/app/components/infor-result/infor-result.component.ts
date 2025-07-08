import { Component, Input } from '@angular/core';
import { IconComponent } from "../../shared/components/icon/icon.component";
import { PdfService } from '../../services/pdf.service';
import { Transport } from '../../shared/types/transport';

@Component({
  selector: 'app-infor-result',
  imports: [IconComponent],
  templateUrl: './infor-result.component.html',
  styleUrl: './infor-result.component.css'
})



export class InforResultComponent {

  exemple = {
    "quantidade": 5,
    "formato": "dry",
    "carregamento": "TEU",
    "origem": "Picos - PI",
    "destino": "Rio de Janeiro - RJ",
    "porto_origem": "São Gonçalo do Amarante",
    "porto_destino": "Itaguaí",
    "transit_time": "Plata",
    "rel_rodoviario": 8.922614,
    "rel_porta_porto": 2.2025862,
    "rel_ativ_porto": 0.26803184,
    "rel_cabotagem": 1.637008,
    "rel_porto_porta": 0.3139647,
    "total_rodoviario": 8.922614,
    "total_mercosul": 4.421591,
    "economia": 4.5,
    "arvores": 74,
    "gelo": 13.5,
    "caminhoes": 3,
    "credito_carbono": 4
  };

  @Input() data?: Transport;

  constructor(private pdfService: PdfService) {}

  get formattedData(): Transport {
    const source = this.data ?? this.exemple;
    return {
      ...source,
      rel_rodoviario: Number(source.rel_rodoviario.toFixed(2)),
      rel_porta_porto: Number(source.rel_porta_porto.toFixed(2)),
      rel_ativ_porto: Number(source.rel_ativ_porto.toFixed(2)),
      rel_cabotagem: Number(source.rel_cabotagem.toFixed(2)),
      rel_porto_porta: Number(source.rel_porto_porta.toFixed(2)),
      total_rodoviario: Number(source.total_rodoviario.toFixed(2)),
      total_mercosul: Number(source.total_mercosul.toFixed(2)),
      economia: Number(source.economia.toFixed(2)),
      arvores: Number(source.arvores.toFixed(2)),
      gelo: Number(source.gelo.toFixed(2)),
      caminhoes: Number(source.caminhoes.toFixed(2)),
      credito_carbono: Number(source.credito_carbono.toFixed(2)),
      quantidade: source.quantidade,
      formato: source.formato,
      carregamento: source.carregamento,
      origem: source.origem,
      destino: source.destino,
      porto_origem: source.porto_origem,
      porto_destino: source.porto_destino,
      transit_time: source.transit_time,
    };
  }

  async generatePdf() {
    const source = this.data ?? this.exemple;
    const dataPdf = {
      rel_rodoviario: Number(source.rel_rodoviario.toFixed(2)),
      rel_porta_porto: Number(source.rel_porta_porto.toFixed(2)),
      rel_ativ_porto: Number(source.rel_ativ_porto.toFixed(2)),
      rel_cabotagem: Number(source.rel_cabotagem.toFixed(2)),
      rel_porto_porta: Number(source.rel_porto_porta.toFixed(2)),
      total_rodoviario: Number(source.total_rodoviario.toFixed(2)),
      total_mercosul: Number(source.total_mercosul.toFixed(2)),
      economia: Number(source.economia.toFixed(2)),
      arvores: Number(source.arvores.toFixed(2)),
      gelo: Number(source.gelo.toFixed(2)),
      caminhoes: Number(source.caminhoes.toFixed(2)),
      credito_carbono: Number(source.credito_carbono.toFixed(2)),
      quantidade: source.quantidade,
      formato: source.formato,
      carregamento: source.carregamento,
      origem: source.origem,
      destino: source.destino,
      porto_origem: source.porto_origem,
      porto_destino: source.porto_destino,
      transit_time: source.transit_time,
    };

    try {
      await this.pdfService.generatePdf('emission-comparison', dataPdf, 'relatorio-co2.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
    
}

