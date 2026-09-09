import type { Metadata } from "next";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Keranjang belanja",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
