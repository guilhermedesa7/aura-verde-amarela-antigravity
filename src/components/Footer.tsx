import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl tracking-wider text-gradient-gold mb-4">BRASIL ELITE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Camisetas premium para quem vive a paixão pelo futebol brasileiro.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider uppercase mb-4 text-foreground">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/colecao" className="hover:text-primary transition-colors">Coleção</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sobre</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider uppercase mb-4 text-foreground">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Prazo de Entrega</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-wider uppercase mb-4 text-foreground">Segurança</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🔒 Pagamento Seguro</li>
              <li>🛡️ Compra Protegida</li>
              <li>📦 Envio Rastreável</li>
              <li>✅ Satisfação Garantida</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 Brasil Elite. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
