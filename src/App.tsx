import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import UrgencyBar from "@/components/UrgencyBar";
import StadiumSound from "@/components/StadiumSound";
import Index from "./pages/Index.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <UrgencyBar />
        <CartDrawer />
        <StadiumSound />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/colecao" element={<CollectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
