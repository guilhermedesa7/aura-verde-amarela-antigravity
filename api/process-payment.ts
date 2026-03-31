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
    const { orderId, customerId, paymentMethod, cardData, total } = req.body;

    const paymentBody: any = {
      'access-token': API_KEY,
      order_id: orderId,
      customer_id: customerId,
      payment_type: paymentMethod, // 'credit_card', 'boleto', 'pix'
    };

    if (paymentMethod === 'credit_card' && cardData) {
      paymentBody.card_number = cardData.number.replace(/\s/g, '');
      paymentBody.card_name = cardData.name;
      paymentBody.card_month = cardData.expiry.split('/')[0];
      paymentBody.card_year = '20' + cardData.expiry.split('/')[1];
      paymentBody.card_cvv = cardData.cvv;
      paymentBody.installments = cardData.installments || 1;
    }

    const response = await fetch('https://admin.appmax.com.br/api/v3/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Payment failed', details: data });
    }

    return res.status(200).json({
      success: true,
      paymentId: data.data?.id,
      status: data.data?.status,
      boleto_url: data.data?.boleto_url,
      pix_qrcode: data.data?.pix_qrcode,
      pix_code: data.data?.pix_code,
      data: data.data,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
