import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import { createCustomer, createOrder, processPayment } from '@/lib/appmax';
import { ArrowLeft, Shield, Lock, CreditCard, CheckCircle, Loader2, QrCode, FileText, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

type PaymentMethod = 'credit_card' | 'boleto' | 'pix';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'info' | 'processing' | 'done'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qrcode?: string; code?: string } | null>(null);
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Pix Enhanced UI State
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === 'processing' && pixData) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        // FUTURO: Local ideal para implementar Polling de Status
        // checkPaymentStatus(orderId).then(status => se 'PAID', setStep('done'))
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, pixData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    if (pixData?.code) {
      navigator.clipboard.writeText(pixData.code).then(() => {
        setCopied(true);
        toast.success('Código PIX copiado com sucesso!');
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        toast.error('Erro ao copiar. Selecione o texto manualmente.');
      });
    }
  };

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', phone: '', cpf: '',
    cep: '', street: '', complement: '', city: '', state: '',
    cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '', installments: '1',
  });

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError(null);
    setLoading(true);

    try {
      // 1. Criar cliente
      const customerRes = await createCustomer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpf: form.cpf,
        address: { cep: form.cep, street: form.street, complement: form.complement, city: form.city, state: form.state },
      });

      // 2. Criar pedido
      const items = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const orderRes = await createOrder(customerRes.customerId, items, cartTotal());

      // 3. Processar pagamento
      const cardData = paymentMethod === 'credit_card' ? {
        number: form.cardNumber,
        name: form.cardName,
        expiry: form.cardExpiry,
        cvv: form.cardCvv,
        installments: parseInt(form.installments),
      } : undefined;

      const paymentRes = await processPayment(
        orderRes.orderId,
        customerRes.customerId,
        paymentMethod,
        cartTotal(),
        cardData,
        form.cpf
      );

      trackEvent('Purchase', { value: cartTotal(), currency: 'BRL', method: paymentMethod });

      if (paymentMethod === 'pix') {
        const qrcode = paymentRes.pix_qrcode || paymentRes.data?.pix_qrcode || paymentRes.data?.qr_code;
        const code = paymentRes.pix_code || paymentRes.data?.pix_emv || paymentRes.data?.emv;
        setPixData({ qrcode, code });
        setStep('processing');
      } else if (paymentMethod === 'boleto') {
        const url = paymentRes.boleto_url || paymentRes.data?.boleto_url || paymentRes.data?.pdf;
        setBoletoUrl(url || null);
        setStep('processing');
      } else {
        // Para cartão: verificar se realmente foi aprovado ou está em processamento
        const successStatuses = ['processing', 'approved', 'authorized', 'paid'];
        if (!paymentRes.status || successStatuses.includes(paymentRes.status.toLowerCase())) {
          clearCart();
          setStep('done');
        } else {
          throw new Error(`Pagamento não aprovado (status: ${paymentRes.status}). Verifique os dados ou tente outra forma.`);
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Erro ao processar pagamento. Tente novamente.';
      const msgLower = errorMsg.toLowerCase();
      const newErrors: Record<string, string> = {};
      
      if (msgLower.includes('cpf') || msgLower.includes('document')) newErrors.cpf = errorMsg;
      else if (msgLower.includes('email') || msgLower.includes('e-mail')) newErrors.email = errorMsg;
      else if (msgLower.includes('cep') || msgLower.includes('postcode')) newErrors.cep = errorMsg;
      else if (msgLower.includes('cartão') || msgLower.includes('cartao') || msgLower.includes('credit') || msgLower.includes('cvv') || msgLower.includes('mês') || msgLower.includes('ano')) newErrors.cardNumber = errorMsg;
      else if (msgLower.includes('phone') || msgLower.includes('telefone') || msgLower.includes('mobile')) newErrors.phone = errorMsg;
      else if (msgLower.includes('name') || msgLower.includes('nome') || msgLower.includes('firstname') || msgLower.includes('lastname')) newErrors.name = errorMsg;
      else setGeneralError(errorMsg);

      setFormErrors(newErrors);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step === 'info') {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
          <Link to="/" className="text-primary hover:underline font-display tracking-wider uppercase text-sm">
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  if (step === 'done') {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md px-6">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold tracking-tight uppercase">Pedido Confirmado!</h1>
          <p className="text-muted-foreground mt-4">Obrigado por sua compra. Você receberá um e-mail com os detalhes do seu pedido.</p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-gradient-gold text-primary-foreground font-display tracking-wider uppercase rounded-lg">
            Voltar à Loja
          </Link>
        </motion.div>
      </main>
    );
  }

  if (step === 'processing') {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center pb-20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md px-6 w-full">
          {pixData ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight uppercase mb-2">Pague com PIX</h1>
                
                <div className="inline-flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-full mb-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs tracking-wider uppercase">Aguardando pagamento...</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  O código expira em <strong className="text-foreground text-lg ml-1 font-mono">{formatTime(timeLeft)}</strong>
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
                <p className="text-sm text-foreground font-medium mb-4">Escaneie o QR Code ou copie o código PIX abaixo</p>
                
                {pixData?.qrcode ? (
                  <div className="bg-white p-2 rounded-lg inline-block mb-6 shadow-sm border border-border">
                    <img
                      src={`data:image/png;base64,${pixData.qrcode}`}
                      alt="QR Code PIX"
                      className="mx-auto w-48 h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className="mx-auto w-48 h-48 mb-6 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <span className="text-sm text-muted-foreground text-center px-4">QR Code indisponível. Use o código abaixo.</span>
                  </div>
                )}

                {pixData.code && (
                  <div className="text-left w-full relative">
                    <div 
                      className="bg-muted border border-border rounded-lg p-3 cursor-text hover:border-primary transition-colors group"
                      onClick={handleCopyPix}
                    >
                      <textarea
                        readOnly
                        value={pixData.code}
                        className="w-full text-xs font-mono bg-transparent resize-none outline-none text-muted-foreground break-all cursor-text group-hover:text-foreground transition-colors"
                        rows={3}
                        onClick={(e) => { e.stopPropagation(); (e.target as HTMLTextAreaElement).select(); }}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full mt-3 h-12 flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground font-display tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity shadow-gold text-sm"
                    >
                      {copied ? (
                        <><Check className="w-4 h-4" /> Copiado!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copiar código PIX</>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">Após o pagamento, esta tela atualizará automaticamente, ou você receberá a confirmação por e-mail.</p>
            </>
          ) : boletoUrl ? (
            <>
              <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold tracking-tight uppercase mb-4">Boleto Gerado</h1>
              <a href={boletoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-12 px-8 bg-gradient-gold text-primary-foreground font-display tracking-wider uppercase rounded-lg">
                Abrir Boleto
              </a>
              <p className="text-sm text-muted-foreground mt-4">O boleto vence em 3 dias úteis.</p>
            </>
          ) : null}
          <Link to="/" className="mt-6 inline-block text-primary hover:underline font-display text-sm tracking-wider uppercase">
            Voltar à Loja
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <div className="container py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-xs text-primary font-medium tracking-wider uppercase">Checkout Seguro</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight uppercase mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {generalError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-2">
                {generalError}
              </div>
            )}
            {/* Dados Pessoais */}
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h2 className="font-display text-lg tracking-wider uppercase">Dados Pessoais</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input type="text" placeholder="Nome completo" required value={form.name} onChange={e => updateForm('name', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.name ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div className="col-span-2">
                  <input type="email" placeholder="E-mail" required value={form.email} onChange={e => updateForm('email', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.email ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <input type="tel" placeholder="Telefone" required value={form.phone} onChange={e => updateForm('phone', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.phone ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <input type="text" placeholder="CPF" required value={form.cpf} onChange={e => updateForm('cpf', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.cpf ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                  {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h2 className="font-display text-lg tracking-wider uppercase">Endereço</h2>
              <div>
                <input type="text" placeholder="CEP" required value={form.cep} onChange={e => updateForm('cep', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.cep ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                {formErrors.cep && <p className="text-red-500 text-xs mt-1">{formErrors.cep}</p>}
              </div>
              <input type="text" placeholder="Rua, número" required value={form.street} onChange={e => updateForm('street', e.target.value)} className="w-full h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Complemento" value={form.complement} onChange={e => updateForm('complement', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                <input type="text" placeholder="Cidade" required value={form.city} onChange={e => updateForm('city', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                <input type="text" placeholder="UF" required value={form.state} onChange={e => updateForm('state', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>

            {/* Método de Pagamento */}
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h2 className="font-display text-lg tracking-wider uppercase flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Pagamento
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {(['credit_card', 'pix', 'boleto'] as PaymentMethod[]).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                      paymentMethod === method
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {method === 'credit_card' ? 'Cartão' : method === 'pix' ? 'PIX' : 'Boleto'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 pt-2">
                  <input type="text" placeholder="Nome no cartão" required value={form.cardName} onChange={e => updateForm('cardName', e.target.value)} className="w-full h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                  <div>
                    <input type="text" placeholder="Número do cartão" required value={form.cardNumber} onChange={e => updateForm('cardNumber', e.target.value)} className={`w-full h-12 bg-muted border ${formErrors.cardNumber ? 'border-red-500' : 'border-border'} rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors`} />
                    {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">

                    <input type="text" placeholder="MM/AA" required value={form.cardExpiry} onChange={e => updateForm('cardExpiry', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                    <input type="text" placeholder="CVV" required value={form.cardCvv} onChange={e => updateForm('cardCvv', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                    <select value={form.installments} onChange={e => updateForm('installments', e.target.value)} className="h-12 bg-muted border border-border rounded-lg px-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>
                          {n}x de R$ {(cartTotal() / n).toFixed(2).replace('.', ',')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <p className="text-sm text-muted-foreground">Após confirmar, você receberá o QR Code para pagamento instantâneo.</p>
              )}

              {paymentMethod === 'boleto' && (
                <p className="text-sm text-muted-foreground">O boleto será gerado após a confirmação. Vence em 3 dias úteis.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-gold text-primary-foreground font-display text-lg tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity shadow-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
              ) : (
                `Pagar ${paymentMethod === 'credit_card' ? 'com Cartão' : paymentMethod === 'pix' ? 'com PIX' : 'com Boleto'}`
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              Seus dados estão protegidos com criptografia SSL
            </div>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <h2 className="font-display text-lg tracking-wider uppercase mb-4">Resumo do Pedido</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded object-cover" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Tam: {item.size} • Qtd: {item.quantity}</p>
                      <p className="text-sm text-primary font-semibold">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {cartTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-brasil-green-light">Grátis</span>
                </div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary font-bold">R$ {cartTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  ou 12x de R$ {(cartTotal() / 12).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CheckoutPage;
