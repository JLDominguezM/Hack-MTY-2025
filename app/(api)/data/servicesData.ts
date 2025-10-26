const servicesData = [
  {
    service_id: "predial_2025",
    name: "Predial",
    description: "Impuesto predial anual",
    average_amount: 1200,
    icon: "🏠",
  },
  {
    service_id: "agua_sep_oct",
    name: "Agua y drenaje",
    description: "Recibo mensual de agua",
    average_amount: 320,
    icon: "💧",
  },
  {
    service_id: "multas_transito",
    name: "Multas y licencias",
    description: "Multas de tránsito y renovación de licencias",
    average_amount: 900,
    icon: "🚔",
  },
  {
    service_id: "impuestos_locales",
    name: "Impuestos locales",
    description: "Impuestos y contribuciones locales",
    average_amount: 500,
    icon: "🏛",
  },
  {
    service_id: "verificacion_vehicular",
    name: "Verificación vehicular",
    description: "Verificación anual de emisiones",
    average_amount: 450,
    icon: "🚗",
  },
];

const usersData = [
  {
    user_id: "user_1",
    name: "Paola Demo",
    city_id: "monterrey",
    email: "paola@example.com",
  },
  {
    user_id: "user_2",
    name: "Daniela Demo",
    city_id: "durango",
    email: "dany@example.com",
  },
];

module.exports = { servicesData, usersData };
