import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/store';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const CollectionPage = () => {
  return (
    <main className="pt-20">
      <section className="py-12 md:py-20 bg-card">
        <div className="container text-center">
          <Reveal>
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary">Copa do Mundo 2026</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase mt-2">
              Coleção Completa
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Cada peça foi desenhada para quem vive o futebol com paixão. Escolha a sua e chegue na Copa com presença.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CollectionPage;
