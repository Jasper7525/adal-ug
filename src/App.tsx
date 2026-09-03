import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SafetyFeatures } from './components/SafetyFeatures';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderSystem } from './components/OrderSystem';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SuccessModal } from './components/SuccessModal';
import { StandaloneCodeModal } from './components/StandaloneCodeModal';
import { OrderItem, CustomerOrderForm } from './types';
import { CYLINDER_PRODUCTS } from './data/products';

export default function App() {
  // Pre-seed cart with 1 popular 6kg domestic refill so user sees live calculated values instantly
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 'default-6kg-refill',
      productId: 'lpg-6kg',
      title: '6kg Household Domestic Cylinder (Gas Refill)',
      type: 'refill',
      size: '6kg',
      unitPriceUGX: 52000,
      quantity: 1,
      image: CYLINDER_PRODUCTS[1].image,
    }
  ]);

  // Modals state
  const [successOrderData, setSuccessOrderData] = useState<{
    referenceNumber: string;
    form: CustomerOrderForm;
    items: OrderItem[];
    totalUGX: number;
    deliveryFeeUGX: number;
  } | null>(null);

  const [codeModalOpen, setCodeModalOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (newItem: OrderItem) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.type === newItem.type
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    // Auto-scroll to order section smoothly
    const orderSec = document.getElementById('order');
    if (orderSec) {
      orderSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItemFromOrder = (item: OrderItem) => {
    handleAddToCart(item);
  };

  const handleOrderSubmit = (
    formData: CustomerOrderForm,
    items: OrderItem[],
    totalUGX: number,
    deliveryFeeUGX: number
  ) => {
    // Generate clean 4-digit reference code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const refNum = `MBR-${randomCode}`;

    setSuccessOrderData({
      referenceNumber: refNum,
      form: formData,
      items: [...items],
      totalUGX,
      deliveryFeeUGX,
    });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        orderItems={orderItems}
        onOpenOrderModal={() => scrollToSection('order')}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* Split-screen Hero Section */}
        <Hero
          onQuickOrder={() => scrollToSection('order')}
          onExploreCatalog={() => scrollToSection('catalog')}
        />

        {/* Corporate Trust & Safety Features */}
        <SafetyFeatures />

        {/* Interactive Product Catalog with Exact Cylinder Sizes & Accessories */}
        <ProductCatalog
          onAddToCart={handleAddToCart}
          onOpenOrderModal={() => scrollToSection('order')}
        />

        {/* Seamless Dynamic Order System with Sticky Summary */}
        <OrderSystem
          orderItems={orderItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItemFromOrder}
          onSubmitOrder={handleOrderSubmit}
        />

        {/* Inquiries & Local Contact Section with Mbarara Depot */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenCodeModal={() => setCodeModalOpen(true)}
      />

      {/* Stylized Floating WhatsApp Dispatch Badge */}
      <FloatingWhatsApp />

      {/* Animated Order Success Modal */}
      <SuccessModal
        isOpen={Boolean(successOrderData)}
        onClose={() => setSuccessOrderData(null)}
        orderData={successOrderData}
      />

      {/* Unified Standalone HTML Code Modal */}
      <StandaloneCodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      />
    </div>
  );
}

