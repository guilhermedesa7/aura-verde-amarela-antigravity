import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    console.log('--- START APPMAX WEBHOOK ---');
    console.log('Payload Received:', JSON.stringify(body, null, 2));

    // Basic validation to ensure the payload has the expected format
    if (!body || !body.data) {
      console.warn('Invalid webhook payload structure - missing data object');
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    const payloadData = body.data;

    // Normalizing main fields into an internal object
    const normalizedData = {
      source: 'appmax',
      event: body.event || 'unknown',
      environment: body.environment || 'production',
      orderId: payloadData.id,
      customerId: payloadData.customer_id,
      status: payloadData.status,
      paymentType: payloadData.payment_type,
      paidAt: payloadData.paid_at,
      billetUrl: payloadData.billet_url || payloadData.pdf,
      total: payloadData.total,
      customerEmail: payloadData.customer?.email,
      raw: body
    };

    console.log('Normalized Webhook Data:', JSON.stringify(normalizedData, null, 2));

    // ==========================================
    // FUTURAS IMPLEMENTAÇÕES:
    // ==========================================
    /*
      // 1. Salvar no banco de dados o log do evento
      await db.webhookLogs.create({ data: normalizedData });
      
      // 2. Atualizar o status do pedido no banco de dados
      if (normalizedData.status === 'aprovado' || normalizedData.status === 'approved' || normalizedData.status === 'paid') {
        await db.order.update({ 
          where: { id: normalizedData.orderId }, 
          data: { status: 'PAID' } 
        });
        
        // 3. Liberar produto
        await platformService.grantAccess(normalizedData.customerId, normalizedData.orderId);
        
        // 4. Enviar email de confirmação
        await emailService.sendPaymentConfirmation(normalizedData.customerEmail, normalizedData.orderId);
      }
    */
    // ==========================================

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Appmax Webhook Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
