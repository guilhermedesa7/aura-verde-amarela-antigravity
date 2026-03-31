const API_BASE = '/api';

const extractAppmaxError = (data: any, defaultMsg: string) => {
  if (!data) return defaultMsg;
  if (data.details?.text) return data.details.text;
  if (data.details?.message) return data.details.message;
  if (data.text) return data.text;
  if (data.message) return data.message;
  if (data.error) return data.error;
  return defaultMsg;
};

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: {
    cep: string;
    street: string;
    complement?: string;
    city: string;
    state: string;
  };
}

interface CartItemData {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  installments?: number;
}

export async function createCustomer(customer: CustomerData) {
  const res = await fetch(`${API_BASE}/create-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(extractAppmaxError(data, 'Erro ao criar cliente'));
  return data;
}

export async function createOrder(customerId: string, items: CartItemData[], total: number) {
  const res = await fetch(`${API_BASE}/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, items, total }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(extractAppmaxError(data, 'Erro ao criar pedido'));
  return data;
}

export async function processPayment(
  orderId: string,
  customerId: string,
  paymentMethod: 'credit_card' | 'boleto' | 'pix',
  total: number,
  cardData?: CardData,
  documentNumber?: string
) {
  const res = await fetch(`${API_BASE}/process-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, customerId, paymentMethod, total, cardData, documentNumber }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(extractAppmaxError(data, 'Erro no pagamento'));
  return data;
}
