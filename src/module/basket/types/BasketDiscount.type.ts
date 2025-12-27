import { DiscountType } from "src/module/discount/enum/type.enum";

export type BasketDiscount ={
  percent?: number;
  amount?: number;
  code: string | null;
  type: DiscountType;
  productId?: number | null;
}