import { Truck, ShieldCheck, RefreshCw, MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

const icons = [Truck, ShieldCheck, RefreshCw, MessageCircle];

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
        {storeConfig.trust.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={item.title} className="flex flex-col items-start gap-2 sm:items-center sm:text-center">
              <Icon className="h-6 w-6 text-accent" />
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
