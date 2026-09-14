"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function updateOrderStatusAction(id: string, formData: FormData) {
  const status = String(formData.get("status") || "");
  if (!VALID_STATUSES.includes(status)) throw new Error("Status tidak valid.");

  const { error } = await supabaseAdmin.from("orders").update({ status, updatedAt: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(`Gagal memperbarui status: ${error.message}`);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
