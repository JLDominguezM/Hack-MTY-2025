// app/(root)/(tabs)/hormi.tsx

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Receipt,
  ArrowLeftRight,
  ChevronDown,
  Leaf,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- DATOS ---
const navigationItems = [
  { icon: Wallet, label: "Mis cuentas", active: false },
  { icon: TrendingUp, label: "Mis inversiones", active: false },
  { icon: Receipt, label: "Pago de servicios", active: false },
  { icon: ArrowLeftRight, label: "Transferir", active: false },
];

const hormiAdvice = [
  "💡 Ahorra el 10% de tus ingresos mensuales para crear tu fondo de emergencia.",
  "🎯 Establece metas financieras a corto, mediano y largo plazo.",
  "📊 Revisa tus gastos semanalmente para identificar en qué puedes ahorrar.",
  "🏦 Aprovecha los beneficios de tus tarjetas para acumular más puntos.",
  "💳 Paga tu tarjeta de crédito antes de la fecha de corte para evitar intereses.",
  "🌟 Usa tus puntos de beneficios para obtener descuentos en empresas asociadas.",
  "📱 Configura alertas de gastos para mantener tu presupuesto bajo control.",
  "🎁 Aprovecha las promociones de meses sin intereses en compras importantes.",
];

const benefits = [
  {
    company: "Starbucks",
    logo: "☕",
    benefit: "20% de descuento",
    points: 50,
    description: "En todas tus bebidas",
  },
  {
    company: "Cinépolis",
    logo: "🎬",
    benefit: "2x1 en boletos",
    points: 100,
    description: "Martes y miércoles",
  },
  {
    company: "Liverpool",
    logo: "🛍️",
    benefit: "15% descuento",
    points: 150,
    description: "En compras mayores a $1,000",
  },
  {
    company: "Uber",
    logo: "🚗",
    benefit: "$100 de descuento",
    points: 80,
    description: "En tu próximo viaje",
  },
  {
    company: "Spotify",
    logo: "🎵",
    benefit: "3 meses gratis",
    points: 200,
    description: "Suscripción Premium",
  },
  {
    company: "Netflix",
    logo: "📺",
    benefit: "1 mes gratis",
    points: 180,
    description: "Plan estándar",
  },
];

// --- COMPONENTE PRINCIPAL ---
// Usamos "export default" para que Expo Router lo reconozca como una pantalla
export default function HormiView() {
  const [showAdvice, setShowAdvice] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState("");
  const userPoints = 20;
  const userLevel = "Bronce";

  const handleHormiClick = () => {
    const randomAdvice =
      hormiAdvice[Math.floor(Math.random() * hormiAdvice.length)];
    setCurrentAdvice(randomAdvice);
    setShowAdvice(true);
  };

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col">
      <HormiHeader />
      <SubNavigation />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-between px-6 pt-8 pb-32">
        <PointsDisplay level={userLevel} points={userPoints} />
        <HormiMascot onClick={handleHormiClick} />
        <BenefitsSheet userPoints={userPoints} />
      </main>

      <AdviceDialog
        advice={currentAdvice}
        isOpen={showAdvice}
        onClose={() => setShowAdvice(false)}
      />
    </div>
  );
}

// --- SUB-COMPONENTES (Hacen el código más limpio) ---

function HormiHeader() {
  return (
    <div className="bg-[#EC0000] text-white sticky top-0 z-10 shadow-md">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <button className="active:bg-white/10 p-2 rounded-lg transition-colors -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white text-xl font-semibold">Hormi</h2>
          <button className="active:bg-white/10 p-2 rounded-lg transition-colors -mr-2">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SubNavigation() {
  return (
    <div className="bg-gray-100 border-b border-gray-300 px-2 py-3">
      <div className="flex items-center justify-around">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700 w-1/4"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PointsDisplay({ level, points }: { level: string; points: number }) {
  return (
    <div className="w-full flex items-center justify-between px-2 mb-8">
      <div className="flex items-center gap-2">
        <Leaf className="w-8 h-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-600">Nivel</p>
          <p className="text-lg font-semibold text-gray-900">{level}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-5xl font-bold text-gray-900">{points}</span>
        <span className="text-lg font-semibold text-gray-700 ml-2">PUNTOS</span>
      </div>
    </div>
  );
}

function HormiMascot({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-8 active:scale-95 transition-transform"
    >
      <img
        src={"/Hormi.png"}
        alt="Mascota Hormi"
        width={280}
        height={280}
        className="object-contain"
      />
    </button>
  );
}

function BenefitsSheet({ userPoints }: { userPoints: number }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-3 active:scale-95 transition-transform">
          <ChevronDown className="w-12 h-12 text-[#EC0000] animate-bounce" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl max-w-[430px] mx-auto bg-white"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl text-center">
            Beneficios Empresas Verdes
          </SheetTitle>
          <p className="text-center text-gray-600">
            Canjea tus puntos por increíbles beneficios
          </p>
        </SheetHeader>
        <div className="space-y-3 overflow-y-auto h-[calc(85vh-120px)] pb-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              userPoints={userPoints}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BenefitCard({
  benefit,
  userPoints,
}: {
  benefit: (typeof benefits)[0];
  userPoints: number;
}) {
  const canRedeem = userPoints >= benefit.points;
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{benefit.logo}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-gray-900 font-semibold">{benefit.company}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              🌿 Verde
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div>
              <p className="text-[#EC0000] font-semibold">{benefit.benefit}</p>
              <p className="text-sm text-gray-500">{benefit.points} puntos</p>
            </div>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                canRedeem
                  ? "bg-[#EC0000] text-white active:bg-[#CC0000]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canRedeem}
            >
              Canjear
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}


function AdviceDialog({
  advice,
  isOpen,
  onClose,
}: {
  advice: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        Añadimos 'bg-white' para forzar el fondo blanco en el modal.
      */}
      <DialogContent className="max-w-[350px] rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#EC0000]">
            <span className="text-2xl">🐜</span>
            Consejo de Hormi
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700 leading-relaxed">{advice}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#EC0000] text-white py-3 rounded-lg active:bg-[#CC0000] transition-colors"
        >
          ¡Gracias, Hormi!
        </button>
      </DialogContent>
    </Dialog>
  );
}