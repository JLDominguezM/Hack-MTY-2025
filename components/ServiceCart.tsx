import {
  Lightbulb,
  Flame,
  Droplet,
  Wifi,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Card } from "./card";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import type { Service } from "@/app/(root)/(tabs)/payServices";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
}

const iconMap = {
  lightbulb: Lightbulb,
  flame: Flame,
  droplet: Droplet,
  wifi: Wifi,
  phone: Phone,
};

const iconColors = {
  lightbulb: "text-yellow-600 bg-yellow-50",
  flame: "text-orange-600 bg-orange-50",
  droplet: "text-blue-600 bg-blue-50",
  wifi: "text-purple-600 bg-purple-50",
  phone: "text-green-600 bg-green-50",
};

export function ServiceCard({
  service,
  isSelected,
  onToggle,
}: ServiceCardProps) {
  const Icon = iconMap[service.icon];
  const isOverdue = service.status === "overdue";
  const dueDate = new Date(service.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className={`p-4 cursor-pointer transition-all active:scale-[0.98] ${
        isSelected ? "ring-2 ring-[#EC0000] bg-red-50/30" : ""
      } ${isOverdue ? "border-red-300" : ""}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-1 h-5 w-5"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />

        <div className={`p-2.5 rounded-xl ${iconColors[service.icon]}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-gray-900">
                {service.name} - {service.provider}
              </h3>
              <p className="text-sm text-gray-500">
                No. {service.accountNumber}
              </p>
            </div>
            {isOverdue && (
              <Badge
                variant="destructive"
                className="flex items-center gap-1 text-xs px-2 py-0.5"
              >
                <AlertCircle className="w-3 h-3" />
                Vencido
              </Badge>
            )}
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vencimiento:</span>
              <span
                className={`text-sm ${
                  isOverdue
                    ? "text-red-600"
                    : daysUntilDue <= 3
                      ? "text-orange-600"
                      : "text-gray-900"
                }`}
              >
                {dueDate.toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
                {!isOverdue && daysUntilDue <= 5 && (
                  <span className="ml-1 text-xs">({daysUntilDue}d)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-900">Monto:</span>
              <span className="text-[#EC0000]">
                $
                {service.amount.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
