const mockServices = [
  {
    id: "S001",
    name: "Impuesto Vehicular Anual",
    amount: 150.0,
    currency: "USD",
  },
  {
    id: "S002",
    name: "Tasa de Residuos Sólidos",
    amount: 25.5,
    currency: "USD",
  },
  {
    id: "S003",
    name: "Permiso de Construcción Menor",
    amount: 50.0,
    currency: "USD",
  },
];

interface Payment {
  payment_id: string;
  user_id: string;
  service_id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  paid_at?: string;
  transaction_id?: string;
  reference_id?: string;
}
const payments: { [key: string]: Payment } = {};
const generateUniqueId = (pref = "p") =>
  `${pref}_${Math.random().toString(36).slice(2, 9)}`;


/**
 * Endpoint: GET /api/gov/services
 * Obtiene la lista de servicios gubernamentales disponibles.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith("/services")) {
    return Response.json({ services: mockServices });
  }

  if (path.endsWith("/payments/status")) {
    const payment_id = url.searchParams.get("id");
    const payment = payments[payment_id || ""];

    if (!payment) {
      return Response.json(
        { error: "Pago no encontrado (Mock)" },
        { status: 404 }
      );
    }
    return Response.json({
      status: payment.status,
      transaction_id: payment.transaction_id,
    });
  }

  return Response.json(
    { error: "Ruta de pago GET no reconocida" },
    { status: 404 }
  );
}

/**
 * Endpoint: POST /api/gov/payments/create O /api/gov/payments/confirm
 * Maneja la creación y confirmación de pagos.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const body = await request.json();

  if (path.endsWith("/payments/create")) {
    const { user_id, service_id, amount, reference_id } = body;

    if (!user_id || !service_id || !amount) {
      return Response.json(
        { error: "Campos requeridos (user_id, service_id, amount)" },
        { status: 400 }
      );
    }

    const payment_id = generateUniqueId("pay");
    payments[payment_id] = {
      payment_id,
      user_id,
      service_id,
      amount: Number(amount),
      status: "pending",
      created_at: new Date().toISOString(),
      reference_id,
    };

    return Response.json(
      {
        payment_id,
        status: "pending",
        message: "Pago creado.",
        tts_audio_url: `https://elevenlabs.com/mock/audio/${payment_id}`,
      },
      { status: 201 }
    );
  }

  if (path.endsWith("/payments/confirm")) {
    const { payment_id } = body;
    const payment = payments[payment_id];

    if (!payment) {
      return Response.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    payment.status = "completed";
    payment.transaction_id = generateUniqueId("txn");
    payment.paid_at = new Date().toISOString();

    return Response.json({
      success: true,
      status: "completed",
      receipt_url: `http://localhost:3000/api/gov/payments/receipt?id=${payment_id}`,
    });
  }

  return Response.json(
    { error: "Ruta de pago POST no reconocida" },
    { status: 404 }
  );
}
