import { useState } from 'react';
import { Wallet, TrendingUp, Receipt, ArrowLeftRight, ChevronDown, Leaf, ArrowLeft, MoreVertical } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { View } from '../App';

const navigationItems = [
  { icon: Wallet, label: 'Mis cuentas', active: false, view: 'home' as View },
  { icon: TrendingUp, label: 'Mis inversiones', active: false, view: null },
  { icon: Receipt, label: 'Pago de servicios', active: false, view: 'payments' as View },
  { icon: ArrowLeftRight, label: 'Transferir', active: false, view: null }
];

const hormiAdvice = [
  "💡 Ahorra el 10% de tus ingresos mensuales para crear tu fondo de emergencia.",
  "🎯 Establece metas financieras a corto, mediano y largo plazo.",
  "📊 Revisa tus gastos semanalmente para identificar en qué puedes ahorrar.",
  "🏦 Aprovecha los beneficios de tus tarjetas para acumular más puntos.",
  "💳 Paga tu tarjeta de crédito antes de la fecha de corte para evitar intereses.",
  "🌟 Usa tus puntos de beneficios para obtener descuentos en empresas asociadas.",
  "📱 Configura alertas de gastos para mantener tu presupuesto bajo control.",
  "🎁 Aprovecha las promociones de meses sin intereses en compras importantes."
];

const benefits = [
  {
    company: 'Starbucks',
    logo: '☕',
    benefit: '20% de descuento',
    points: 50,
    description: 'En todas tus bebidas'
  },
  {
    company: 'Cinépolis',
    logo: '🎬',
    benefit: '2x1 en boletos',
    points: 100,
    description: 'Martes y miércoles'
  },
  {
    company: 'Liverpool',
    logo: '🛍️',
    benefit: '15% descuento',
    points: 150,
    description: 'En compras mayores a $1,000'
  },
  {
    company: 'Uber',
    logo: '🚗',
    benefit: '$100 de descuento',
    points: 80,
    description: 'En tu próximo viaje'
  },
  {
    company: 'Spotify',
    logo: '🎵',
    benefit: '3 meses gratis',
    points: 200,
    description: 'Suscripción Premium'
  },
  {
    company: 'Netflix',
    logo: '📺',
    benefit: '1 mes gratis',
    points: 180,
    description: 'Plan estándar'
  }
];

interface HormiViewProps {
  onNavigate: (view: View) => void;
}

export function HormiView({ onNavigate }: HormiViewProps) {
  const [showAdvice, setShowAdvice] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState('');
  const userPoints = 20;
  const userLevel = 'Bronce';

  const handleHormiClick = () => {
    const randomAdvice = hormiAdvice[Math.floor(Math.random() * hormiAdvice.length)];
    setCurrentAdvice(randomAdvice);
    setShowAdvice(true);
  };

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col">
      {/* Header rojo */}
      <div className="bg-[#EC0000] text-white sticky top-0 z-10 shadow-md">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('home')}
              className="active:bg-white/10 p-2 rounded-lg transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-white">Hormi</h2>
            <button className="active:bg-white/10 p-2 rounded-lg transition-colors -mr-2">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navegación superior */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-3">
        <div className="flex items-center justify-between">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => item.view && onNavigate(item.view)}
                className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Nivel y Puntos */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Nivel</p>
              <p className="text-gray-900">{userLevel}</p>
            </div>
          </div>
          
          <div className="h-12 w-px bg-gray-300"></div>
          
          <div>
            <p className="text-5xl text-gray-900">{userPoints} <span className="text-2xl">PUNTOS</span></p>
          </div>
        </div>

        {/* Hormi - La hormiga */}
        <button 
          onClick={handleHormiClick}
          className="mb-8 active:scale-95 transition-transform"
        >
          <div className="relative">
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Antenas */}
              <path d="M140 80 Q130 40, 120 20" stroke="#2d2d2d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M140 80 Q150 40, 160 20" stroke="#2d2d2d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <circle cx="120" cy="20" r="4" fill="#2d2d2d"/>
              <circle cx="160" cy="20" r="4" fill="#2d2d2d"/>
              
              {/* Cabeza */}
              <ellipse cx="140" cy="100" rx="35" ry="40" fill="#E63946"/>
              <ellipse cx="140" cy="100" rx="30" ry="35" fill="#DC143C"/>
              
              {/* Ojos */}
              <ellipse cx="130" cy="95" rx="10" ry="15" fill="#2d2d2d"/>
              <ellipse cx="150" cy="95" rx="10" ry="15" fill="#2d2d2d"/>
              <ellipse cx="132" cy="92" rx="4" ry="6" fill="white"/>
              <ellipse cx="152" cy="92" rx="4" ry="6" fill="white"/>
              
              {/* Boca */}
              <path d="M130 110 Q140 115, 150 110" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Tórax */}
              <ellipse cx="140" cy="150" rx="25" ry="20" fill="#C1121F"/>
              
              {/* Abdomen */}
              <ellipse cx="140" cy="200" rx="50" ry="55" fill="#E63946"/>
              <ellipse cx="140" cy="200" rx="45" ry="50" fill="#DC143C"/>
              <ellipse cx="130" cy="190" rx="15" ry="20" fill="#E63946" opacity="0.5"/>
              
              {/* Patas delanteras */}
              <path d="M115 140 L85 170 L75 180" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M165 140 L195 170 L205 180" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              
              {/* Patas medias */}
              <path d="M120 165 L90 200 L85 215" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M160 165 L190 200 L195 215" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              
              {/* Patas traseras */}
              <path d="M125 220 L100 250 L95 260" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M155 220 L180 250 L185 260" stroke="#2d2d2d" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </button>

        {/* Flecha */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-3 active:scale-95 transition-transform">
              <ChevronDown className="w-12 h-12 text-[#EC0000] animate-bounce" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl max-w-[430px] mx-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl text-center">Beneficios Empresas Verdes</SheetTitle>
              <p className="text-center text-gray-600">Canje tus puntos por increíbles beneficios</p>
            </SheetHeader>
            
            <div className="space-y-3 overflow-y-auto h-[calc(85vh-120px)] pb-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{benefit.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900">{benefit.company}</h3>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          🌿 Verde
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-[#EC0000]">{benefit.benefit}</p>
                          <p className="text-sm text-gray-500">{benefit.points} puntos</p>
                        </div>
                        <button 
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            userPoints >= benefit.points
                              ? 'bg-[#EC0000] text-white active:bg-[#CC0000]'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={userPoints < benefit.points}
                        >
                          Canjear
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Dialog de consejos de Hormi */}
      <Dialog open={showAdvice} onOpenChange={setShowAdvice}>
        <DialogContent className="max-w-[350px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#EC0000]">
              <span className="text-2xl">🐜</span>
              Consejo de Hormi
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 leading-relaxed">{currentAdvice}</p>
          </div>
          <button
            onClick={() => setShowAdvice(false)}
            className="w-full bg-[#EC0000] text-white py-3 rounded-lg active:bg-[#CC0000] transition-colors"
          >
            ¡Gracias, Hormi!
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
