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

      // Aguardar carregamento das imagens
      await this.waitForImagesToLoad(tempContainer);
      
      // Converter imagens para base64
      await this.convertImagesToBase64(tempContainer);

      await new Promise(resolve => setTimeout(resolve, 500));

      await this.convertToPdf(tempContainer, fileName);
     
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  private async waitForImagesToLoad(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve mesmo com erro
        }
      });
    });
    await Promise.all(imagePromises);
  }

  private async convertImagesToBase64(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    
    for (const img of Array.from(images)) {
      try {
        const base64 = await this.imageToBase64(img.src);
        img.src = base64;
      } catch (error) {
        console.warn('Erro ao converter imagem:', img.src, error);
      }
    }
  }

  private imageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Não foi possível obter contexto do canvas'));
        }
      };
      
      img.onerror = reject;
      img.src = url;
    });
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
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        ${css}
      </style>
    `;

    container.innerHTML = pdfOptimizedCSS + html;
    return container;
  }

  private async convertToPdf(container: HTMLElement, fileName: string): Promise<void> {
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
        imageTimeout: 0,
        removeContainer: false
      });

      const pdf = new jsPDF.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
            'JPEG', 
            0, 
            -yPosition, 
            pdfWidth, 
            pdfHeight,
            undefined,
            'FAST'
          );
          
          yPosition += pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
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