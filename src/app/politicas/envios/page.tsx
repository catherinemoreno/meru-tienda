import { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";

export const metadata: Metadata = { title: "Política de envíos" };

export default function EnviosPage() {
  return (
    <PolicyPage title="Envíos" updatedAt="Septiembre de 2026">
      <p>Realizamos envíos a la mayoría de ciudades y municipios de Colombia.</p>
      <h2>Tiempos de entrega</h2>
      <p>
        Ciudades principales: 2 a 4 días hábiles. Otros municipios: 3 a 7 días hábiles, según
        cobertura de la transportadora.
      </p>
      <h2>Costo de envío</h2>
      <p>El envío es gratuito en todos nuestros pedidos, sin monto mínimo de compra.</p>
      <h2>Seguimiento</h2>
      <p>
        Una vez despachado tu pedido, te compartiremos el número de guía por WhatsApp o correo
        electrónico para que puedas hacerle seguimiento.
      </p>
      <h2>Pago contra entrega</h2>
      <p>
        Pagas al mensajero cuando recibas tu pedido en la puerta de tu casa, en efectivo o por
        datáfono.
      </p>
    </PolicyPage>
  );
}
