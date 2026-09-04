import { storeConfig } from "@/config/store";

export default function TopBanner() {
  if (!storeConfig.topBanner.enabled) return null;
  return (
    <div className="bg-accent text-[#1a1408] text-xs sm:text-sm font-medium py-2 text-center px-4">
      {storeConfig.topBanner.text}
    </div>
  );
}
