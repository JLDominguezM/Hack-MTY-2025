import {
  Settings,
  ChevronRight,
  User,
  Bell,
  Wallet,
  TrendingUp,
  Receipt,
  ArrowLeftRight,
  CreditCard,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";

import { useRouter, Href } from "expo-router";

type NavigationItem = {
  icon?: React.ElementType;
  label: string;
  active: boolean;
  href: Href | null;
  isHormi?: boolean;
};

const navigationItems: NavigationItem[] = [
  { icon: Wallet, label: "Mis\ncuentas", active: true, href: null },
  {
    icon: TrendingUp,
    label: "Mis\ninversiones",
    active: false,
    href: "/investments",
  },
  {
    icon: Receipt,
    label: "Pago de\nservicios",
    active: false,
    href: "/payServices",
  },
  {
    icon: ArrowLeftRight,
    label: "Transferir",
    active: false,
    href: "/transfer",
  },
  { label: "Hormi", active: false, href: "/hormi", isHormi: true },
];

export default function BanorteHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 max-w-[430px] mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-[#EC0000] text-white px-4 pt-3 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            <div className="bg-white rounded-full p-1.5 mt-0.5">
              <User className="w-4 h-4 text-[#EC0000]" />
            </div>
            <div>
              <h1 className="text-white mb-0.5">Hola Daniela</h1>
              <p className="text-[11px] text-white/90 leading-tight">
                Último ingreso
                <br />
                24-10-2025 04:05 p.m. Móvil
              </p>
            </div>
          </div>
          <button className="relative mt-0.5">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border border-[#EC0000]"></span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#3a3a3a] px-2 py-3">
        {/* Use justify-around for better spacing with 5 items */}
        <div className="flex items-center justify-around">
          {navigationItems.map((item, index) => {
            if (item.isHormi) {
              return (
                <button
                  key={index}
                  onClick={() => item.href && router.push(item.href as Href)}
                  className="flex flex-col items-center gap-1 px-2 text-gray-400 w-1/5"
                  disabled={!item.href}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {/* SVG for Hormi icon */}
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="10"
                        cy="6"
                        rx="3"
                        ry="3.5"
                        fill="currentColor"
                      />
                      <ellipse
                        cx="10"
                        cy="12"
                        rx="2.5"
                        ry="2"
                        fill="currentColor"
                      />
                      <ellipse
                        cx="10"
                        cy="18"
                        rx="4"
                        ry="4.5"
                        fill="currentColor"
                      />
                      <line
                        x1="7.5"
                        y1="10.5"
                        x2="5"
                        y2="13.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <line
                        x1="12.5"
                        y1="10.5"
                        x2="15"
                        y2="13.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <line
                        x1="6.5"
                        y1="16.5"
                        x2="3.5"
                        y2="21"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <line
                        x1="13.5"
                        y1="16.5"
                        x2="16.5"
                        y2="21"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] text-center whitespace-pre-line leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            }

            const Icon = item.icon!; 
            return (
              <button
                key={index}
                onClick={() => item.href && router.push(item.href as Href)}
                className={`flex flex-col items-center gap-1 px-2 ${
                  item.active ? "text-white" : "text-gray-400"
                } w-1/5`}
                disabled={!item.href}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] text-center whitespace-pre-line leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-3 py-3 space-y-3 pb-28">
        {" "}
        {/* Increased padding-bottom */}
        {/* Promotional Banner */}
        <Card className="bg-gradient-to-r from-[#f15a29] to-[#e94e1b] text-white p-0 overflow-hidden relative border-0 h-[100px]">
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-[#f15a29] to-[#e94e1b]" />
          </div>
          <div className="relative z-10 p-3 flex items-center justify-between h-full">
            <div className="flex-1">
              <p className="text-sm mb-1">Daniela</p>
              <p className="text-xs leading-tight max-w-[140px]">
                Conoce las promociones
                <br />
                que tenemos para ti
              </p>
            </div>
            <button className="bg-white text-[#f15a29] px-3 py-1.5 rounded text-xs whitespace-nowrap shadow-md">
              Ver ofertas
            </button>
          </div>
        </Card>
        {/* My Accounts Section */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-gray-900">Mis cuentas</h2>
          <button className="p-1">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {/* Payroll Account Card */}
        <Card className="p-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="8"
                    width="16"
                    height="10"
                    rx="1.5"
                    stroke="#666"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M8 8V6a4 4 0 0 1 8 0v2"
                    stroke="#666"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="12" cy="13" r="1.5" fill="#666" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-900 mb-0.5">Nómina Banorte 2</h3>
                <p className="text-sm text-gray-600">****7355</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-900">$ 8.02 MN</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </Card>
        {/* Card Benefits Card */}
        <Card className="bg-gradient-to-r from-[#f9c74f] to-[#f8b739] p-3 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-0.5">
                  Beneficios de mis tarjetas
                </h3>
                <p className="text-sm text-gray-700">
                  Promociones, puntos y más...
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </div>
        </Card>
        {/* Contract Here Card */}
        <Card className="bg-gradient-to-r from-[#f15a29] to-[#e94e1b] p-3 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-0.5">Contrata aquí</h3>
                <p className="text-sm text-white/90">
                  Tarjeta de Crédito, Pagarés y más
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </Card>
      </div>

      {/* Bottom Menu Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#5a5e66] py-3">
        <button className="w-full text-white text-center">Menú</button>
      </div>
    </div>
  );
}
