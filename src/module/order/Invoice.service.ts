// src/modules/invoice/invoice.service.ts
import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly orderService: OrderService) {}

  async generateInvoice(orderId: number) {
    const order = await this.orderService.findById(orderId);
    
    if (!order.payment?.status) {
      throw new Error('فاکتور فقط برای سفارشات پرداخت شده موجود است');
    }

// ساخت آیتم‌های فاکتور
const items = [] as Array<{
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}>;

if (order.orderItems && Array.isArray(order.orderItems)) {
  for (let i = 0; i < order.orderItems.length; i++) {
    const item = order.orderItems[i];
    items.push({
      name: item.product?.name || 'محصول',
      quantity: item.quantity || 0,
      unitPrice: item.product?.price || 0,
      total: (item.product?.price || 0) * (item.quantity || 0)
    });
  }
}

    const invoiceData = {
      invoiceNumber: order.payment?.invoice_number || `INV-${order.id}-${Date.now()}`,
      orderId: order.id,
      date: order.create_at,
      customer: {
        name: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
        mobile: order.user?.mobile || '',
      },
      items: items,
      totals: {
        subtotal: order.total_amount || 0,
        discount: order.discount_amount || 0,
        shipping: 0,
        total: order.final_amount || 0
      },
      companyInfo: {
        name: 'فروشگاه شما',
        address: 'آدرس فروشگاه',
        phone: '021-12345678',
        email: 'info@example.com'
      }
    };

    return invoiceData;
  }

  async generateInvoicePDF(orderId: number): Promise<Buffer> {
    const invoiceData = await this.generateInvoice(orderId);
    return Buffer.from(JSON.stringify(invoiceData));
  }

  async generateInvoiceHTML(orderId: number): Promise<string> {
    const invoiceData = await this.generateInvoice(orderId);
    return this.generateInvoiceHTMLFromData(invoiceData);
  }

  private generateInvoiceHTMLFromData(invoiceData: any): string {
    let itemsHTML = '';
    
    if (invoiceData.items && Array.isArray(invoiceData.items)) {
      itemsHTML = invoiceData.items.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${this.formatPrice(item.unitPrice)}</td>
          <td>${this.formatPrice(item.total)}</td>
        </tr>
      `).join('');
    }

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Tahoma, Arial; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-info { margin-bottom: 30px; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
          th { background-color: #f5f5f5; }
          .totals { margin-top: 30px; text-align: left; }
          .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { margin-top: 50px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاکتور فروش</h1>
          <h3>${invoiceData.companyInfo.name}</h3>
        </div>
        
        <div class="company-info">
          <p>${invoiceData.companyInfo.address}</p>
          <p>تلفن: ${invoiceData.companyInfo.phone} | ایمیل: ${invoiceData.companyInfo.email}</p>
        </div>
        
        <div class="invoice-info">
          <div>
            <p><strong>شماره فاکتور:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>تاریخ:</strong> ${new Date(invoiceData.date).toLocaleDateString('fa-IR')}</p>
          </div>
          <div>
            <p><strong>شماره سفارش:</strong> ${invoiceData.orderId}</p>
          </div>
        </div>
        
        <div class="customer-info">
          <h3>مشخصات مشتری</h3>
          <p><strong>نام:</strong> ${invoiceData.customer.name || 'ندارد'}</p>
          <p><strong>تلفن:</strong> ${invoiceData.customer.mobile}</p>
          <p><strong>ایمیل:</strong> ${invoiceData.customer.email || 'ندارد'}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام محصول</th>
              <th>تعداد</th>
              <th>قیمت واحد</th>
              <th>مبلغ کل</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>جمع کل:</span>
            <span>${this.formatPrice(invoiceData.totals.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>تخفیف:</span>
            <span>${this.formatPrice(invoiceData.totals.discount)}</span>
          </div>
          <div class="total-row" style="font-weight: bold; font-size: 1.2em;">
            <span>مبلغ قابل پرداخت:</span>
            <span>${this.formatPrice(invoiceData.totals.total)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>با تشکر از خرید شما</p>
          <p>${invoiceData.companyInfo.name}</p>
        </div>
      </body>
      </html>
    `;
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }


  async generateOrderExcel(orderId: number): Promise<Buffer> {
    const order = await this.orderService.findById(orderId);
    
    // ساخت اطلاعات برای Excel
    const orderData = {
      orderId: order.id,
      orderNumber: `ORD-${order.id}`,
      date: order.create_at,
      status: order.status,
      customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      customerMobile: order.user?.mobile || '',
      address: order.address,
      totalAmount: order.total_amount || 0,
      discountAmount: order.discount_amount || 0,
      finalAmount: order.final_amount || 0,
      itemsCount: this.getOrderItemsCount(order)
    };

    // ساخت CSV ساده
    const csvData = Object.entries(orderData)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');
    
    return Buffer.from(csvData);
  }


    private getOrderItems(order: any): Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }> {
    const items = [] as Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;

    if (order.orderItems) {
      if (Array.isArray(order.orderItems)) {
        for (let i = 0; i < order.orderItems.length; i++) {
          const item = order.orderItems[i];
          items.push({
            name: item.product?.name || 'محصول',
            quantity: item.quantity || 0,
            unitPrice: item.product?.price || 0,
            total: (item.product?.price || 0) * (item.quantity || 0)
          });
        }
      } else if (typeof order.orderItems === 'object') {
        // اگر تک آبجکت باشد
        const item = order.orderItems;
        items.push({
          name: item.product?.name || 'محصول',
          quantity: item.quantity || 0,
          unitPrice: item.product?.price || 0,
          total: (item.product?.price || 0) * (item.quantity || 0)
        });
      }
    }

    return items;
  }

  private getOrderItemsCount(order: any): number {
    if (!order.orderItems) return 0;
    
    if (Array.isArray(order.orderItems)) {
      return order.orderItems.length;
    } else if (typeof order.orderItems === 'object') {
      return 1;
    }
    
    return 0;
  }
  
}