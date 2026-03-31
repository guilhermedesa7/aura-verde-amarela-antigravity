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
    const { name, email, phone, cpf, address } = req.body;

    const response = await fetch('https://admin.appmax.com.br/api/v3/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'access-token': API_KEY,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
        email,
        telephone: phone.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        postcode: address.cep.replace(/\D/g, ''),
        address: address.street,
        city: address.city,
        region: address.state,
        country_id: 'BR',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to create customer', details: data });
    }

    return res.status(200).json({ customerId: data.data.id, data: data.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
