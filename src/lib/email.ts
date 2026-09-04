// Servicio de correo transaccional.
// FASE ACTUAL: stub que solo registra en consola el envío simulado.
// FUTURO: integrar Resend usando env.resend.apiKey — la firma de
// sendNewOrderEmail(order) no debería cambiar, solo su implementación interna.
import { env } from "@/config/env";
import { storeConfig } from "@/config/store";
import { Order } from "@/types";

export async function sendNewOrderEmail(order: Order): Promise<void> {
  // TODO(fase futura): reemplazar por una llamada real al SDK de Resend, ej:
  //   const resend = new Resend(env.resend.apiKey);
  //   await resend.emails.send({
  //     from: env.resend.fromEmail,
  //     to: storeConfig.contact.adminEmail,
  //     subject: `Nuevo pedido ${order.number}`,
  //     react: <NewOrderEmail order={order} />,
  //   });

  console.log("──────────────────────────────────────────");
  console.log("📧  [EMAIL SIMULADO] Nuevo pedido recibido");
  console.log(`   Para: ${storeConfig.contact.adminEmail}`);
  console.log(`   Pedido: ${order.number}`);
  console.log(`   Cliente: ${order.customer.fullName} · ${order.customer.phone}`);
  console.log(`   Ciudad: ${order.customer.city}, ${order.customer.department}`);
  console.log(`   Total: $${order.total.toLocaleString("es-CO")}`);
  console.log(`   (Resend API key configurada: ${Boolean(env.resend.apiKey)})`);
  console.log("──────────────────────────────────────────");

  return Promise.resolve();
}
