import { Wallet, TrendingUp, Receipt, ArrowLeftRight, CreditCard } from 'lucide-react';

const navItems = [
  { icon: Wallet, label: 'Mis cuentas', active: false },
  { icon: TrendingUp, label: 'Mis inversiones', active: false },
  { icon: Receipt, label: 'Pago de servicios', active: true },
  { icon: ArrowLeftRight, label: 'Transferir', active: false },
  { icon: CreditCard, label: 'Tarjetas', active: false }
];

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex flex-col items-center gap-2 py-4 px-6 min-w-fit transition-colors ${
                  item.active
                    ? 'text-[#EC0000] border-b-2 border-[#EC0000]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
