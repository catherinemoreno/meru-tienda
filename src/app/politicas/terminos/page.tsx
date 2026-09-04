import { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function TerminosPage() {
  return (
    <PolicyPage title="Términos y condiciones" updatedAt="Septiembre de 2026">
      <p>
        Al realizar una compra en {storeConfig.name} aceptas los siguientes términos y
        condiciones.
      </p>
      <h2>Pedidos</h2>
      <p>
        Todo pedido está sujeto a disponibilidad de inventario. Nos reservamos el derecho de
        cancelar un pedido si detectamos información incorrecta o intentos de fraude.
      </p>
      <h2>Precios</h2>
      <p>
        Los precios están expresados en pesos colombianos (COP) e incluyen IVA cuando aplica.
        Pueden cambiar sin previo aviso.
      </p>
      <h2>Pago contra entrega</h2>
      <p>
        Nuestra forma de pago actual es contra entrega: pagas en efectivo o datáfono al recibir tu
        pedido.
      </p>
      <h2>Responsabilidad</h2>
      <p>
        No nos hacemos responsables por retrasos causados por la transportadora o por datos de
        entrega incorrectos suministrados por el cliente.
      </p>
    </PolicyPage>
  );
}
