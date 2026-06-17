export type BasketProduct = {
  id: number;
  slug: string;
  title: string;
  originalPrice: number;        // قیمت اصلی (قبل از تخفیف)
  discountPercent: number | null;
  discountAmount: number | null;
  finalPrice: number;           // قیمت نهایی بعد از اعمال تخفیف
  quantity: number;
}