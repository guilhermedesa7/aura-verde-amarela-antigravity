import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.APPMAX_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { customerId, items, total } = req.body;

    const products = items.map((item: any) => ({
      sku: item.productId,
      name: item.name,
      qty: item.quantity,
      price: item.price,
    }));

    const response = await fetch('https://admin.appmax.com.br/api/v3/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'access-token': API_KEY,
        customer_id: customerId,
        products,
        freight: 0,
        freight_type: 'Frete Grátis',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to create order', details: data });
    }

    return res.status(200).json({ orderId: data.data.id, data: data.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
