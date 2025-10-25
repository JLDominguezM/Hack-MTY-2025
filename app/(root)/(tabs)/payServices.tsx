import { useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCart";
import { PaymentSummary } from "@/components/PaymentSummary";
import { View } from "@/types/type";

export interface Service {
  id: string;
  name: string;
  provider: string;
  amount: number;
  dueDate: string;
  accountNumber: string;
  icon: "lightbulb" | "flame" | "droplet" | "wifi" | "phone";
  status: "pending" | "overdue" | "paid";
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Luz",
    provider: "CFE",
    amount: 1250.5,
    dueDate: "2025-10-28",
    accountNumber: "1234567890",
    icon: "lightbulb",
    status: "pending",
  },
  {
    id: "2",
    name: "Gas",
    provider: "Gas Natural",
    amount: 850.0,
    dueDate: "2025-10-30",
    accountNumber: "0987654321",
    icon: "flame",
    status: "pending",
  },
  {
    id: "3",
    name: "Agua",
    provider: "SACMEX",
    amount: 320.75,
    dueDate: "2025-11-05",
    accountNumber: "5556667777",
    icon: "droplet",
    status: "pending",
  },
  {
    id: "4",
    name: "Internet",
    provider: "Telmex",
    amount: 599.0,
    dueDate: "2025-11-01",
    accountNumber: "4445556666",
    icon: "wifi",
    status: "pending",
  },
  {
    id: "5",
    name: "Teléfono",
    provider: "Telcel",
    amount: 399.0,
    dueDate: "2025-10-26",
    accountNumber: "5551234567",
    icon: "phone",
    status: "overdue",
  },
];

interface PaymentServicesViewProps {
  onNavigate: (view: View) => void;
}

export default function PaymentServicesView({
  onNavigate,
}: PaymentServicesViewProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === mockServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(mockServices.map((s) => s.id));
    }
  };

  const selectedTotal = mockServices
    .filter((service) => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="bg-[#EC0000] text-white sticky top-0 z-10 shadow-md">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate("home")}
              className="active:bg-white/10 p-2 rounded-lg transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-white">Pago de Servicios</h2>
            <button className="active:bg-white/10 p-2 rounded-lg transition-colors -mr-2">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-4 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-900">Pago de Servicios</h1>
          <button onClick={handleSelectAll} className="text-[#EC0000] text-sm">
            {selectedServices.length === mockServices.length
              ? "Deseleccionar"
              : "Seleccionar todos"}
          </button>
        </div>

        <div className="space-y-3">
          {mockServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onToggle={() => handleToggleService(service.id)}
            />
          ))}
        </div>
      </main>

      <PaymentSummary
        selectedCount={selectedServices.length}
        totalAmount={selectedTotal}
      />
    </div>
  );
}
