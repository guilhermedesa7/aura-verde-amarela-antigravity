import { create } from 'zustand';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import camisaAzul from '@/assets/camisa-azul.jpg';
import camisaAmarela from '@/assets/camisa-amarela.jpg';
import azulDetalhe1 from '@/assets/azul-detalhe1.jpg';
import azulDetalhe2 from '@/assets/azul-detalhe2.jpg';
import azulDetalhe3 from '@/assets/azul-detalhe3.jpg';
import azulDetalhe4 from '@/assets/azul-detalhe4.jpg';
import azulCostas from '@/assets/azul-costas.jpg';
import azulDetalhe5 from '@/assets/azul-detalhe5.jpg';
import amarelaDetalhe1 from '@/assets/amarela-detalhe1.jpg';
import amarelaDetalhe2 from '@/assets/amarela-detalhe2.jpg';
import amarelaDetalhe3 from '@/assets/amarela-detalhe3.jpg';
import amarelaDetalhe4 from '@/assets/amarela-detalhe4.jpg';
import amarelaDetalhe5 from '@/assets/amarela-detalhe5.jpg';
import amarelaDetalhe6 from '@/assets/amarela-detalhe6.jpg';
import amarelaCostas from '@/assets/amarela-costas.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  badge?: string;
  rating: number;
  reviews: number;
  stock: number;
  video?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotal: () => number;
  cartCount: () => number;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  cartOpen: false,
  addToCart: (product, size, quantity = 1) => {
    set((state) => {
      const existing = state.cart.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          cartOpen: true,
        };
      }
      return { cart: [...state.cart, { product, size, quantity }], cartOpen: true };
    });
  },
  removeFromCart: (productId, size) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    }));
  },
  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, size);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    }));
  },
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  setCartOpen: (open) => set({ cartOpen: open }),
  cartTotal: () =>
    get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
  clearCart: () => set({ cart: [] }),
}));

export const products: Product[] = [
  {
    id: 'camisa-copa-2026-azul',
    name: 'Camiseta Copa 2026 Azul',
    description: 'A força do azul profundo com design moderno e padrão digital exclusivo. Tecnologia Dry-Fit e acabamento premium para a Copa do Mundo 2026.',
    price: 199.90,
    originalPrice: 299.90,
    images: [camisaAzul, azulDetalhe1, azulCostas, azulDetalhe3, azulDetalhe4, azulDetalhe2, azulDetalhe5],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'COPA 2026',
    rating: 4.9,
    reviews: 1240,
    stock: 18,
    video: '/hero-video.mp4',
  },
  {
    id: 'camisa-copa-2026-amarela',
    name: 'Camiseta Copa 2026 Amarela',
    description: 'O amarelo clássico do Brasil com design geométrico exclusivo. A camisa que carrega a tradição e a energia da seleção canarinho na Copa 2026.',
    price: 199.90,
    originalPrice: 299.90,
    images: [camisaAmarela, amarelaDetalhe1, amarelaCostas, amarelaDetalhe2, amarelaDetalhe3, amarelaDetalhe4, amarelaDetalhe5, amarelaDetalhe6],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'COPA 2026',
    rating: 4.9,
    reviews: 2310,
    stock: 12,
    video: '/amarela-video.mp4',
  },
  {
    id: 'camisa-titular-copa',
    name: 'Camisa Titular Copa 2026',
    description: 'A camisa oficial para quem vive a paixão pelo Brasil. Tecido premium Dry-Fit com tecnologia de ventilação avançada. Edição limitada Copa do Mundo 2026.',
    price: 189.90,
    originalPrice: 279.90,
    images: [product1],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'MAIS VENDIDA',
    rating: 4.9,
    reviews: 2847,
    stock: 23,
  },
  {
    id: 'camisa-reserva-premium',
    name: 'Camisa Reserva Premium',
    description: 'O azul profundo do Brasil em uma peça sofisticada. Acabamento premium com detalhes em dourado. Para quem quer se destacar na torcida.',
    price: 199.90,
    originalPrice: 299.90,
    images: [product2],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'LANÇAMENTO',
    rating: 4.8,
    reviews: 1923,
    stock: 15,
  },
  {
    id: 'camisa-treino-black',
    name: 'Camisa Treino Black Edition',
    description: 'Edição especial em preto com detalhes em verde e dourado. Para o torcedor que quer estilo dentro e fora do campo. Série limitada.',
    price: 169.90,
    originalPrice: 249.90,
    images: [product3],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'EDIÇÃO LIMITADA',
    rating: 4.9,
    reviews: 3156,
    stock: 8,
  },
  {
    id: 'camisa-special-white',
    name: 'Camisa Special White Gold',
    description: 'A elegância do branco com toques em dourado e verde. Uma peça de colecionador para os verdadeiros apaixonados pelo Brasil.',
    price: 219.90,
    originalPrice: 329.90,
    images: [product4],
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    badge: 'EXCLUSIVA',
    rating: 5.0,
    reviews: 876,
    stock: 5,
  },
];
