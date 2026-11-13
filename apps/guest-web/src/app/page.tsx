'use client';

import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Bell, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Minus, 
  X,
  CreditCard,
  QrCode
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  prepTimeMin: number;
  tags: string[];
  variants?: Array<{ id: string; name: string; price: number }>;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function GuestOrderingPage() {
  const [selectedTable, setSelectedTable] = useState('T04');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; selectedVariant?: string; price: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStep, setOrderStep] = useState<'PLACED' | 'PREPARING' | 'READY'>('PLACED');
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback demo data if backend is offline, or fetch from backend
  const fallbackMenu: Category[] = [
    {
      id: 'cat-1',
      name: 'Starters & Appetizers',
      items: [
        {
          id: 'item-1',
          name: 'Paneer Tikka Angaare',
          description: 'Charcoal-grilled cottage cheese cubes marinated in spiced hung curd with peppers and onions.',
          price: 320,
          isVeg: true,
          prepTimeMin: 15,
          tags: ['Bestseller', 'Spicy'],
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Main Course',
      items: [
        {
          id: 'item-2',
          name: 'Murgh Makhani (Butter Chicken)',
          description: 'Tender chicken tandoori pieces simmered in rich satin-smooth tomato, butter and cashew gravy.',
          price: 450,
          isVeg: false,
          prepTimeMin: 20,
          tags: ['Chef Special', 'Bestseller'],
          variants: [
            { id: 'v1', name: 'Half (2 pcs)', price: 290 },
            { id: 'v2', name: 'Full (4 pcs)', price: 450 },
          ],
        },
        {
          id: 'item-3',
          name: 'Dal Makhani Bukhara',
          description: 'Slow-cooked black lentils simmered overnight with butter, cream, and aromatic spices.',
          price: 340,
          isVeg: true,
          prepTimeMin: 10,
          tags: ['Classic'],
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Breads & Rice',
      items: [
        {
          id: 'item-4',
          name: 'Garlic Butter Naan',
          description: 'Clay-oven fired flatbread topped with minced roasted garlic and fresh cilantro butter.',
          price: 75,
          isVeg: true,
          prepTimeMin: 8,
          tags: ['Tandoori'],
        },
      ],
    },
    {
      id: 'cat-4',
      name: 'Beverages & Desserts',
      items: [
        {
          id: 'item-5',
          name: 'Kesariya Mango Lassi',
          description: 'Traditional Punjabi churned yoghurt drink blended with Alphonso mango pulp and saffron.',
          price: 150,
          isVeg: true,
          prepTimeMin: 5,
          tags: ['Refreshing', 'Bestseller'],
        },
      ],
    },
  ];

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(fallbackMenu);
        }
      })
      .catch(() => setCategories(fallbackMenu))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item: MenuItem, variant?: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const price = variant ? variant.price : item.price;
      const variantName = variant ? variant.name : undefined;
      const existing = prev.find(
        (c) => c.item.id === item.id && c.selectedVariant === variantName,
      );
      if (existing) {
        return prev.map((c) =>
          c === existing ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { item, quantity: 1, selectedVariant: variantName, price }];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity += delta;
      if (next[index].quantity <= 0) {
        return next.filter((_, i) => i !== index);
      }
      return next;
    });
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const gstAmount = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gstAmount;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setIsCartOpen(false);
    // Simulate kitchen progression
    setTimeout(() => setOrderStep('PREPARING'), 5000);
    setTimeout(() => setOrderStep('READY'), 12000);
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 5000);
  };

  const handleRequestBill = () => {
    setBillRequested(true);
  };

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (vegOnly && !item.isVeg) return false;
      return true;
    }),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50">
      {/* Top Banner / Restaurant Header */}
      <header className="bg-emerald-900 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-700/80 flex items-center justify-center font-bold text-lg border border-emerald-500/40">
              <Utensils className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide leading-tight">The Grand Masala Bistro</h1>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dining Hall • Table <strong className="text-white bg-emerald-800 px-1.5 py-0.5 rounded text-[11px]">{selectedTable}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-800/80 px-2.5 py-1.5 rounded-full text-xs border border-emerald-700">
            <QrCode className="w-3.5 h-3.5 text-emerald-300" />
            <span>Self-Order</span>
          </div>
        </div>

        {/* Veg Only Toggle & Table Changer */}
        <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
                vegOnly
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-emerald-800/70 text-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-300"></span>
              Pure Veg
            </button>
          </div>
          <div className="text-[11px] text-emerald-300">
            GST No: 07AAAAA0000A1Z5
          </div>
        </div>
      </header>

      {/* Notification Toast for Calling Waiter */}
      {waiterCalled && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top sticky top-[105px] z-40 shadow">
          <span>🔔 Waiter has been notified for Table {selectedTable}!</span>
          <button onClick={() => setWaiterCalled(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Order Tracker Banner (If Order Placed) */}
      {orderPlaced && (
        <div className="mx-4 mt-3 p-3.5 bg-white rounded-2xl shadow-sm border border-emerald-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Live Order #104 (Table {selectedTable})
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
              {orderStep === 'PLACED' && 'Sent to Kitchen'}
              {orderStep === 'PREPARING' && 'Chef is Preparing'}
              {orderStep === 'READY' && 'Ready to Serve'}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between relative px-2 pt-1">
            <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0"></div>
            <div
              className={`flex flex-col items-center gap-1 z-10 transition-all ${
                orderStep === 'PLACED' || orderStep === 'PREPARING' || orderStep === 'READY'
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span className="text-[10px]">Placed</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1 z-10 transition-all ${
                orderStep === 'PREPARING' || orderStep === 'READY'
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  orderStep === 'PREPARING' || orderStep === 'READY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {orderStep === 'PREPARING' ? '⏳' : '✓'}
              </div>
              <span className="text-[10px]">Cooking</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1 z-10 transition-all ${
                orderStep === 'READY' ? 'text-emerald-600 font-semibold' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  orderStep === 'READY' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                🍽️
              </div>
              <span className="text-[10px]">Serving</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Navigation */}
      <div className="sticky top-[105px] z-20 bg-slate-50/95 backdrop-blur px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Items
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <main className="flex-1 px-4 py-3 space-y-6">
        {filteredCategories
          .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
          .map((cat) => (
            <section key={cat.id} className="space-y-3">
              <h2 className="text-sm font-bold tracking-tight text-slate-700 uppercase flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-[11px] font-normal text-slate-400 lowercase">{cat.items.length} items</span>
              </h2>

              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5">
                          {/* Veg/Non-Veg Icon */}
                          <span
                            className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-xs ${
                              item.isVeg ? 'border-green-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-green-600' : 'bg-rose-600'
                              }`}
                            ></span>
                          </span>
                          <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                            {item.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs font-bold text-slate-900">
                            ₹{item.price.toFixed(0)}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {item.prepTimeMin}m
                          </span>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium border border-amber-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Add Button or Variants */}
                      <div className="flex flex-col items-end gap-1.5">
                        {item.variants && item.variants.length > 0 ? (
                          <div className="flex flex-col gap-1 items-end">
                            {item.variants.map((v) => (
                              <button
                                key={v.id}
                                onClick={() => addToCart(item, v)}
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 active:scale-95 transition-all hover:bg-emerald-100 flex items-center gap-1"
                              >
                                <span>{v.name}</span>
                                <strong>₹{v.price}</strong>
                                <Plus className="w-3 h-3 text-emerald-600" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-3 z-30 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCallWaiter}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-medium mt-0.5">Call Waiter</span>
          </button>

          <button
            onClick={handleRequestBill}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Receipt className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-medium mt-0.5">Bill</span>
          </button>
        </div>

        {/* View Cart Button */}
        {cart.length > 0 ? (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex-1 ml-3 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-700/20 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-100 text-[11px] flex items-center justify-center">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
              <span>View Cart</span>
            </div>
            <span>₹{grandTotal.toFixed(0)}</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 italic px-2">Cart is empty</div>
        )}
      </footer>

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end max-w-md mx-auto">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">Your Table Cart ({selectedTable})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="py-3 flex-1 overflow-y-auto space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-slate-900">{item.item.name}</span>
                    {item.selectedVariant && (
                      <span className="text-[11px] text-slate-500 block">({item.selectedVariant})</span>
                    )}
                    <span className="text-slate-600 font-medium">₹{item.price} each</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-slate-900 w-12 text-right">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%)</span>
                <span>₹{gstAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Payable</span>
                <span className="text-emerald-700">₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Order Placement Button */}
            <button
              onClick={handlePlaceOrder}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              <span>Send Order to Kitchen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bill & Payment Modal */}
      {billRequested && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                Table {selectedTable} Bill
              </h3>
              <button
                onClick={() => setBillRequested(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Ordered</span>
                <span>{cart.length > 0 ? cart.reduce((a, c) => a + c.quantity, 0) : 3} items</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{cartTotal > 0 ? cartTotal : 840}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (2.5%) + SGST (2.5%)</span>
                <span>₹{cartTotal > 0 ? gstAmount : 42}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-emerald-800">₹{cartTotal > 0 ? grandTotal : 882}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  alert('Opening UPI / Razorpay payment modal...');
                  setBillRequested(false);
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pay via UPI / Card (Razorpay)
              </button>

              <button
                onClick={() => {
                  alert('Waiter requested to collect cash at Table ' + selectedTable);
                  setBillRequested(false);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-semibold text-xs transition-all"
              >
                Pay Cash at Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
