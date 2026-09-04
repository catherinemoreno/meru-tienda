import { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Cambios y devoluciones" };

export default function CambiosPage() {
  return (
    <PolicyPage title="Cambios y devoluciones" updatedAt="Septiembre de 2026">
      <p>
        Queremos que quedes feliz con tu compra. Si algo no te queda bien o no era lo que
        esperabas, tienes hasta 8 días calendario después de recibido el producto para
        solicitar un cambio.
      </p>
      <h2>Condiciones</h2>
      <p>
        El producto debe estar sin uso, con su empaque original y accesorios completos. Los
        gastos de envío de la devolución corren por cuenta del cliente, salvo que se trate de un
        error nuestro o un producto defectuoso.
      </p>
      <h2>¿Cómo solicitar un cambio?</h2>
      <p>
        Escríbenos por WhatsApp al +{storeConfig.whatsapp.number} indicando tu número de pedido y
        el motivo del cambio. Te guiaremos en todo el proceso.
      </p>
      <h2>Productos defectuosos</h2>
      <p>
        Si tu producto llega con un defecto de fábrica, lo cambiamos sin costo adicional dentro de
        los primeros 8 días.
      </p>
    </PolicyPage>
  );
}
