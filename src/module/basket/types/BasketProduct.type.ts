export type BasketProduct = {
  id: number;
  slug: string;
  title: string;
  originalPrice: number;        
  discountPercent: number | null;
  discountAmount: number | null;
  finalPrice: number;         
  quantity: number;
  image:string
  stock:number
}