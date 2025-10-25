import { ArrowRight } from "lucide-react";
import { Button } from "@react-navigation/elements";

interface PaymentSummaryProps {
  selectedCount: number;
  totalAmount: number;
}

export function PaymentSummary({
  selectedCount,
  totalAmount,
}: PaymentSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl max-w-[430px] mx-auto">
      <div className="px-4 py-4">
        {selectedCount > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {selectedCount} {selectedCount === 1 ? "servicio" : "servicios"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-gray-900">
                $
                {totalAmount.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        )}

        <Button
          disabled={selectedCount === 0}
          className="w-full bg-[#EC0000] hover:bg-[#CC0000] active:bg-[#BB0000] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedCount === 0 ? "Selecciona un servicio" : "Pagar servicios"}
          {/* {selectedCount > 0 && <ArrowRight className="w-5 h-5 ml-2" />} */}
        </Button>
      </div>
    </div>
  );
}
