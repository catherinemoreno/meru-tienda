import { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <PolicyPage title="Política de privacidad" updatedAt="Septiembre de 2026">
      <p>
        En {storeConfig.name} respetamos tu privacidad y protegemos los datos personales que nos
        compartes al realizar una compra o contactarnos.
      </p>
      <h2>Datos que recopilamos</h2>
      <p>
        Recopilamos nombre, celular, correo electrónico y dirección de entrega únicamente para
        procesar y despachar tus pedidos.
      </p>
      <h2>Uso de la información</h2>
      <p>
        Usamos tus datos para confirmar pedidos, coordinar la entrega y brindarte atención al
        cliente. No vendemos ni compartimos tu información con terceros ajenos al proceso de envío.
      </p>
      <h2>Seguridad</h2>
      <p>
        Implementamos medidas razonables para proteger tu información contra accesos no
        autorizados.
      </p>
      <h2>Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política, escríbenos a {storeConfig.contact.supportEmail}.
      </p>
    </PolicyPage>
  );
}
