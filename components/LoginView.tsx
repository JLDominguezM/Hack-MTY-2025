import { User, ArrowLeftRight, Banknote, CreditCard, Smartphone, AlertTriangle, Wallet, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { View } from '../App';
import loginBanner from 'figma:asset/9a4c4dbb43a1ced9215477b01a73a24cd0cb8741.png';

interface LoginViewProps {
  onNavigate: (view: View) => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  return (
    <div className="min-h-screen bg-gray-100 max-w-[430px] mx-auto flex flex-col">
      {/* Header Banorte */}
      <div className="bg-[#EC0000] px-4 py-3 flex items-center">
        <svg width="140" height="32" viewBox="0 0 140 32" fill="none">
          <path d="M8 4h12v8H8z" fill="white"/>
          <path d="M22 4h12v8H22z" fill="white"/>
          <text x="38" y="22" fill="white" fontSize="20" fontWeight="bold">BANORTE</text>
        </svg>
      </div>

      {/* Banner de bienvenida con imagen */}
      <div className="relative h-64">
        <ImageWithFallback 
          src={loginBanner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        
        {/* Botones laterales */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <button className="bg-[#EC0000] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg relative">
            <User className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#EC0000] rounded-full flex items-center justify-center text-[10px]">5</span>
          </button>
          <button className="bg-white text-gray-700 rounded-full w-11 h-11 flex items-center justify-center shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="12" r="2" fill="#333"/>
              <circle cx="12" cy="12" r="2" fill="#333"/>
              <circle cx="18" cy="12" r="2" fill="#333"/>
            </svg>
          </button>
          <button className="bg-[#EC0000] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg text-xl">
            +
          </button>
        </div>

        {/* Badge estrellas */}
        <div className="absolute top-3 left-20 bg-white/90 text-gray-800 px-3 py-1 rounded-md text-sm shadow-md">
          ★★★★
        </div>

        {/* Tarjeta de chat */}
        <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <div className="bg-[#EC0000] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">¡Chatea conmigo!</p>
              <p className="text-[#EC0000] mb-0.5">Conoce tu app</p>
              <p className="text-xs text-gray-600 leading-tight">Cambia el NIP de tu tarjeta<br/>desde tu celular</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Hola Daniela */}
      <div className="px-3 pt-3 pb-2">
        <button 
          onClick={() => onNavigate('home')}
          className="w-full bg-[#8a9099] text-white py-4 rounded-lg shadow-md active:bg-[#7a8089] transition-colors"
        >
          <h2 className="text-white mb-0.5">Hola, Daniela</h2>
          <p className="text-sm text-white/90">¿Qué vamos a hacer?</p>
        </button>
      </div>

      {/* Botón Menú */}
      <div className="px-3 pb-3">
        <button className="w-full bg-[#5a5e66] text-white py-3 rounded-lg shadow-md">
          Menú
        </button>
      </div>

      {/* Grid de opciones */}
      <div className="px-3 pb-6">
        <div className="bg-white rounded-2xl p-5 shadow-md grid grid-cols-3 gap-y-5 gap-x-3">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-center text-gray-800">Mis cuentas</span>
          </button>

          <button className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-center text-gray-800 leading-tight">Transferir<br/>o pagar</span>
          </button>

          <button className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <Banknote className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-center text-gray-800 leading-tight">Retirar<br/>dinero</span>
          </button>

          <button className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-center text-gray-800 leading-tight">Tarjeta<br/>Digital</span>
          </button>

          <button className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <circle cx="12" cy="18" r="1.5" fill="white"/>
                <path d="M8 6h8M8 10h8"/>
              </svg>
            </div>
            <span className="text-xs text-center text-gray-800 leading-tight">Token<br/>Celular</span>
          </button>

          <button className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 bg-[#3d4149] rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-center text-gray-800">Asistencia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
