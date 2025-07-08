// src/app/services/pdf.service.ts
import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateLoaderService } from './template-loader.service';
import { Transport } from '../shared/types/transport';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private templateLoader: TemplateLoaderService) {}

  async generatePdf(templateName: string, data: Transport, fileName: string = 'document.pdf'): Promise<void> {
    try {
      const template = await this.templateLoader.loadTemplate(templateName).toPromise();
      if (!template) {
        throw new Error(`Template "${templateName}" could not be loaded.`);
      }
      const { html, css } = template;

      const processedHtml = this.processTemplate(html, data);

      const tempContainer = this.createPdfContainer(processedHtml, css);
      document.body.appendChild(tempContainer);

      await new Promise(resolve => setTimeout(resolve, 100));

      await this.convertToPdf(tempContainer, fileName);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  private createPdfContainer(html: string, css: string): HTMLElement {
    const container = document.createElement('div');
    container.id = 'pdf-container-temp';
    
    container.style.cssText = `
      position: absolute;
      top: -9999px;
      left: 0;
      width: 1600px;
      min-height: 1123px;
      background: white;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      transform: scale(1);
      transform-origin: top left;
    `;

    const pdfOptimizedCSS = `
      <style>
        
        
        ${css}
      </style>
    `;

    container.innerHTML = pdfOptimizedCSS + html;
    return container;
  }

  private async convertToPdf(container: HTMLElement, fileName: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
  
    const canvas = await html2canvas(container, {
      scale: 3,
      logging: true, 
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight
    });

      const pdf = new jsPDF.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 0;
        
        while (yPosition < pdfHeight) {
          if (yPosition > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            -yPosition, 
            pdfWidth, 
            pdfHeight
          );
          
          yPosition += pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(fileName);
      
    } finally {
      const tempContainer = document.getElementById('pdf-container-temp');
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
    }
  }

  private processTemplate(html: string, data: Transport): string {

    return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const typedKey = key as keyof Transport;
      return data[typedKey] !== undefined ? data[typedKey] as string : match;
    });
  }
}