import { ArrowLeft, MoreVertical } from "lucide-react";

export function Header() {
  return (
    <header className="bg-[#EC0000] text-white sticky top-0 z-10 shadow-md">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <button className="active:bg-white/10 p-2 rounded-lg transition-colors -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">Pago de Servicios</h2>
          <button className="active:bg-white/10 p-2 rounded-lg transition-colors -mr-2">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
