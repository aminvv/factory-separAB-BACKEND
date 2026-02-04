// src/modules/invoice/invoice.controller.ts
import { Controller, Get, Param, Res, Header } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './Invoice.service';

@Controller('admin/orders/invoice') 
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':orderId/html')
  @Header('Content-Type', 'text/html')
  async getInvoiceHTML(
    @Param('orderId') orderId: number,
    @Res() res: Response
  ) {
    try {
      const html = await this.invoiceService.generateInvoiceHTML(orderId);
      res.send(html);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  @Get(':orderId/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="invoice.pdf"')
  async getInvoicePDF(
    @Param('orderId') orderId: number,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.invoiceService.generateInvoicePDF(orderId);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}