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
    const { orderId, customerId, paymentMethod, cardData, documentNumber, total } = req.body;

    const cleanCpf = documentNumber ? documentNumber.replace(/\D/g, '') : undefined;

    // NEW ENDPOINT LOGIC:
    let endpoint = 'https://admin.appmax.com.br/api/v3/payment';
    
    // Strict Nested Payload required by Appmax V3 specific endpoints
    const paymentBody: any = {
      'access-token': API_KEY,
      cart: {
        order_id: orderId
      },
      customer: {
        customer_id: customerId
      }
    };

    if (paymentMethod === 'credit_card') {
      endpoint += '/credit-card';
      if (cardData) {
        paymentBody.payment = {
          CreditCard: {
            document_number: cleanCpf,
            installments: cardData.installments || 1,
            card_number: cardData.number.replace(/\s/g, ''),
            card_name: cardData.name,
            card_expiration_month: cardData.expiry.split('/')[0],
            card_expiration_year: '20' + cardData.expiry.split('/')[1],
            card_cvv: cardData.cvv,
          }
        };
      }
    } else if (paymentMethod === 'pix') {
      endpoint += '/pix';
      if (cleanCpf) {
        paymentBody.payment = {
          Pix: {
            document_number: cleanCpf
          }
        };
      }
    } else if (paymentMethod === 'boleto') {
      endpoint += '/boleto';
      if (cleanCpf) {
        paymentBody.payment = {
          Boleto: {
            document_number: cleanCpf
          }
        };
      }
    }

    console.log('--- START APPMAX PAYMENT ---');
    console.log('1. Target Endpoint:', endpoint);
    console.log('2. Payment Body to Appmax:', JSON.stringify(paymentBody, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentBody),
    });

    console.log('3. HTTP Status from Appmax:', response.status);

    const rawText = await response.text();
    console.log('4. Raw Appmax Response Text:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
      console.log('5. Parsed JSON Object:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return res.status(500).json({ error: 'Invalid JSON from Appmax', rawText });
    }

    if (!response.ok || (data.status && data.status >= 400) || data.success === false || data.error) {
      return res.status(400).json({ 
        error: data.message || data.error || 'Payment failed in Appmax', 
        details: data,
        debug_endpoint_used: endpoint,
        debug_payload_sent: paymentBody,
      });
    }

    // Retorna exatamente a estrutura que a Appmax devolveu, 
    // mas também inclui os campos que o front-end espera para Pix.
    return res.status(200).json({
      success: true,
      paymentId: data?.data?.id || data?.id,
      status: data?.data?.status || data?.status,
      boleto_url: data?.data?.boleto_url || data?.data?.pdf || data?.pdf,
      pix_qrcode: data?.data?.pix_qrcode || data?.data?.pix_qrcode_url || data?.data?.qr_code || data?.pix_qrcode,
      pix_code: data?.data?.pix_emv || data?.data?.pix_code || data?.data?.emv || data?.pix_emv,
      data: data.data || data,
      debug_raw_text: rawText,
      debug_endpoint_used: endpoint,
      debug_payload_sent: paymentBody,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
