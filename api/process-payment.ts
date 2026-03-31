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

    console.log('--- START APPMAX PIX PAYMENT ---');
    console.log('1. Payment Body to Appmax:', JSON.stringify(paymentBody, null, 2));

    const response = await fetch('https://admin.appmax.com.br/api/v3/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentBody),
    });

    console.log('2. HTTP Status from Appmax:', response.status);

    const rawText = await response.text();
    console.log('3. Raw Appmax Response Text:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
      console.log('4. Parsed JSON Object:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return res.status(500).json({ error: 'Invalid JSON from Appmax', rawText });
    }

    if (!response.ok || (data.status && data.status >= 400) || data.success === false || data.error) {
      return res.status(400).json({ 
        error: data.message || data.error || 'Payment failed in Appmax', 
        details: data 
      });
    }

    // Retorna exatamente a estrutura que a Appmax devolveu, 
    // mas também inclui os campos que o front-end espera para Pix.
    // Assim o front-end pode ler 'paymentRes.data.pix_qrcode' se quisermos.
    return res.status(200).json({
      success: true,
      paymentId: data?.data?.id || data?.id,
      status: data?.data?.status || data?.status,
      boleto_url: data?.data?.boleto_url || data?.data?.pdf || data?.pdf,
      pix_qrcode: data?.data?.pix_qrcode || data?.data?.pix_qrcode_url || data?.data?.qr_code || data?.pix_qrcode,
      pix_code: data?.data?.pix_emv || data?.data?.pix_code || data?.data?.emv || data?.pix_emv,
      data: data.data || data,
      debug_raw_text: rawText
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
