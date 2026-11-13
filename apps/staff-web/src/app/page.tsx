'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  ChefHat, 
  Sparkles, 
  Bell, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

type TableStatus = 
  | 'AVAILABLE' 
  | 'OCCUPIED' 
  | 'PAYMENT_PENDING' 
  | 'NEEDS_CLEANING' 
  | 'CLEANING_IN_PROGRESS' 
  | 'RESERVED' 
  | 'OUT_OF_SERVICE';

interface Table {
  id: string;
  label: string;
  capacity: number;
  status: TableStatus;
  floor: 'Indoor' | 'Terrace';
  guests?: number;
  dwellTime?: string;
  billAmount?: number;
  cleanerName?: string;
  reservedAt?: string;
  hasAlert?: {
    type: string;
    message: string;
    timeOpen: string;
  };
}

export default function StaffPortalPage() {
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'KDS' | 'CLEANING'>('FLOOR');
  const [activeFloor, setActiveFloor] = useState<'Indoor' | 'Terrace'>('Indoor');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Simulated live floor state initialized with realistic data
  const [tables, setTables] = useState<Table[]>([
    { id: 't1', label: 'T01', capacity: 2, status: 'AVAILABLE', floor: 'Indoor' },
    { 
      id: 't2', 
      label: 'T02', 
      capacity: 4, 
      status: 'OCCUPIED', 
      floor: 'Indoor', 
      guests: 3, 
      dwellTime: '24m',
      hasAlert: { type: 'Call Waiter', message: 'Requested extra napkins & water', timeOpen: '1m 20s' }
    },
    { 
      id: 't3', 
      label: 'T03', 
      capacity: 4, 
      status: 'OCCUPIED', 
      floor: 'Indoor', 
      guests: 4, 
      dwellTime: '48m' 
    },
    { 
      id: 't4', 
      label: 'T04', 
      capacity: 6, 
      status: 'PAYMENT_PENDING', 
      floor: 'Indoor', 
      guests: 5, 
      billAmount: 1840,
      dwellTime: '1h 12m' 
    },
    { id: 't5', label: 'T05', capacity: 2, status: 'NEEDS_CLEANING', floor: 'Indoor', dwellTime: 'waiting 4m' },
    { id: 't6', label: 'T06', capacity: 8, status: 'AVAILABLE', floor: 'Indoor' },
    { 
      id: 't7', 
      label: 'T07', 
      capacity: 4, 
      status: 'OCCUPIED', 
      floor: 'Terrace', 
      guests: 2, 
      dwellTime: '35m',
      hasAlert: { type: 'Order Delayed', message: 'Murgh Makhani cooking 22m', timeOpen: '4m' }
    },
    { id: 't8', label: 'T08', capacity: 4, status: 'CLEANING_IN_PROGRESS', floor: 'Terrace', cleanerName: 'Sunil', dwellTime: 'cleaning 2m' },
    { id: 't9', label: 'T09', capacity: 2, status: 'AVAILABLE', floor: 'Terrace' },
    { id: 't10', label: 'T10', capacity: 6, status: 'RESERVED', floor: 'Terrace', reservedAt: '8:30 PM' },
  ]);

  // Initial table selection
  useEffect(() => {
    setSelectedTable(tables[1]);
  }, []);

  // Kitchen Tickets State
  const [kitchenTickets, setKitchenTickets] = useState([
    {
      id: 'K-101',
      table: 'T02',
      items: [
        { name: 'Paneer Tikka Angaare', qty: 2, note: 'Extra spicy' },
        { name: 'Garlic Butter Naan', qty: 4, note: 'Crispy' },
      ],
      timeElapsed: '12m',
      status: 'PREPARING' as 'NEW' | 'PREPARING' | 'READY',
      targetMin: 15,
    },
    {
      id: 'K-102',
      table: 'T07',
      items: [
        { name: 'Murgh Makhani (Full)', qty: 1, note: 'Less spicy' },
        { name: 'Dal Makhani Bukhara', qty: 1, note: 'Extra butter' },
      ],
      timeElapsed: '22m',
      status: 'PREPARING' as 'NEW' | 'PREPARING' | 'READY',
      targetMin: 20,
    },
    {
      id: 'K-103',
      table: 'T03',
      items: [
        { name: 'Kesariya Mango Lassi', qty: 3, note: 'Chilled' },
      ],
      timeElapsed: '4m',
      status: 'NEW' as 'NEW' | 'PREPARING' | 'READY',
      targetMin: 8,
    },
  ]);

  const updateTicketStatus = (id: string, newStatus: 'PREPARING' | 'READY') => {
    setKitchenTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );
  };

  const handleOverrideStatus = (tableId: string, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: newStatus, hasAlert: undefined } : t)),
    );
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable((prev) => prev ? { ...prev, status: newStatus, hasAlert: undefined } : null);
    }
  };

  const resolveAlert = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, hasAlert: undefined } : t)),
    );
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable((prev) => prev ? { ...prev, hasAlert: undefined } : null);
    }
  };

  // Status Colors & Badges
  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'AVAILABLE' };
      case 'OCCUPIED':
        return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: 'OCCUPIED' };
      case 'PAYMENT_PENDING':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'PAYMENT' };
      case 'NEEDS_CLEANING':
        return { bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'CLEAN' };
      case 'CLEANING_IN_PROGRESS':
        return { bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30', label: 'CLEANING' };
      case 'RESERVED':
        return { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', label: 'RESERVED' };
      default:
        return { bg: 'bg-slate-700 text-slate-300 border-slate-600', label: 'OUT OF ORDER' };
    }
  };

  const currentFloorTables = tables.filter((t) => t.floor === activeFloor);
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'PAYMENT_PENDING').length;
  const alertCount = tables.filter((t) => t.hasAlert).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
            SR
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-wide text-white">
              The Grand Masala Bistro
            </h1>
            <p className="text-xs text-slate-400">Floor & Operations Command Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('FLOOR')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'FLOOR'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Floor Map</span>
          </button>

          <button
            onClick={() => setActiveTab('KDS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'KDS'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen (KDS)</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {kitchenTickets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CLEANING')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'CLEANING'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cleaning Queue</span>
          </button>
        </div>

        {/* Staff User Avatar */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 bg-teal-950/60 border border-teal-800/80 px-2.5 py-1.5 rounded-lg"
          >
            <span>Open Guest App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-teal-400">
              PS
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-medium block leading-none text-slate-200">Priya Sharma</span>
              <span className="text-[10px] text-teal-400 font-mono">Floor Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'FLOOR' && (
        <div className="flex-1 flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header KPI Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-400 block font-medium">Occupied Tables</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-rose-400">{occupiedCount}</span>
                <span className="text-xs text-slate-500 font-mono">/ {tables.length}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-400 block font-medium">Guests Seated</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">14</span>
                <span className="text-xs text-slate-500 font-mono">/ 42 cap</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-400 block font-medium">Floor Capacity</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-teal-400">
                  {Math.round((occupiedCount / tables.length) * 100)}%
                </span>
                <span className="text-xs text-emerald-400 font-medium">Moderate</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-400 block font-medium">Avg Dwell Time</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-200">46</span>
                <span className="text-xs text-slate-500 font-mono">minutes</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-400 block font-medium">Open Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-black ${alertCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
                  {alertCount}
                </span>
                <span className="text-xs text-amber-500 font-medium">Action needed</span>
              </div>
            </div>
          </div>

          {/* Floor Selector & Layout Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Floor Map (Left 2 Columns) */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col">
              {/* Floor Switcher */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFloor('Indoor')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFloor === 'Indoor'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Indoor Dining Hall (6 Tables)
                  </button>
                  <button
                    onClick={() => setActiveFloor('Terrace')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFloor === 'Terrace'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Terrace Garden (4 Tables)
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Live Engine Connected
                </div>
              </div>

              {/* Table Grid (Visualized exactly as wireframed in SRMS-09) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 flex-1 content-start">
                {currentFloorTables.map((table) => {
                  const badge = getStatusBadge(table.status);
                  const isSelected = selectedTable?.id === table.id;

                  return (
                    <div
                      key={table.id}
                      onClick={() => setSelectedTable(table)}
                      className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between min-h-[130px] ${
                        isSelected
                          ? 'ring-2 ring-teal-400 border-transparent bg-slate-800/90 shadow-xl'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      {/* Active Alert Pulse Ring */}
                      {table.hasAlert && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs animate-bounce shadow-md">
                          !
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white">{table.label}</h3>
                          <span className="text-[11px] text-slate-400">{table.capacity} seats</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Dynamic Tile Info Based on State */}
                      <div className="mt-4 text-xs font-medium">
                        {table.status === 'OCCUPIED' && (
                          <div className="text-rose-300 flex items-center justify-between">
                            <span>{table.guests} guests</span>
                            <span className="font-mono text-slate-400">{table.dwellTime}</span>
                          </div>
                        )}
                        {table.status === 'PAYMENT_PENDING' && (
                          <div className="text-amber-300 font-bold flex items-center justify-between">
                            <span>Bill Pending</span>
                            <span>₹{table.billAmount}</span>
                          </div>
                        )}
                        {table.status === 'NEEDS_CLEANING' && (
                          <div className="text-yellow-300 text-[11px] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{table.dwellTime}</span>
                          </div>
                        )}
                        {table.status === 'CLEANING_IN_PROGRESS' && (
                          <div className="text-sky-300 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{table.cleanerName} ({table.dwellTime})</span>
                          </div>
                        )}
                        {table.status === 'RESERVED' && (
                          <div className="text-purple-300 text-[11px]">
                            <span>At {table.reservedAt}</span>
                          </div>
                        )}
                        {table.status === 'AVAILABLE' && (
                          <div className="text-emerald-400 text-[11px]">
                            <span>Ready to seat</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table Details & Actions (Right Column) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              {selectedTable ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>Table {selectedTable.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusBadge(selectedTable.status).bg}`}>
                          {selectedTable.status}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{selectedTable.floor} Floor • {selectedTable.capacity} Seats</p>
                    </div>
                  </div>

                  {/* Active Alert Banner if any */}
                  {selectedTable.hasAlert && (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          {selectedTable.hasAlert.type}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">Open {selectedTable.hasAlert.timeOpen}</span>
                      </div>
                      <p className="text-xs text-amber-200/90">{selectedTable.hasAlert.message}</p>
                      <button
                        onClick={() => resolveAlert(selectedTable.id)}
                        className="mt-1 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition-all active:scale-98"
                      >
                        Acknowledge & Resolve Alert
                      </button>
                    </div>
                  )}

                  {/* Current Active Session Overview */}
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Session Status</span>
                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>Current Dwell:</span>
                        <span className="text-white font-bold">{selectedTable.dwellTime || '0m'}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Seated Guests:</span>
                        <span className="text-white font-bold">{selectedTable.guests || 0}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Bill Amount:</span>
                        <span className="text-emerald-400 font-bold">₹{selectedTable.billAmount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Manager Override State Machine Actions */}
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Manager Override</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => handleOverrideStatus(selectedTable.id, 'AVAILABLE')}
                        className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-all font-semibold text-left"
                      >
                        ✓ Mark Available
                      </button>
                      <button
                        onClick={() => handleOverrideStatus(selectedTable.id, 'OCCUPIED')}
                        className="p-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/80 hover:bg-rose-900 transition-all font-semibold text-left"
                      >
                        👤 Seat Walk-In
                      </button>
                      <button
                        onClick={() => handleOverrideStatus(selectedTable.id, 'NEEDS_CLEANING')}
                        className="p-2 rounded-xl bg-yellow-950/60 text-yellow-300 border border-yellow-800/80 hover:bg-yellow-900 transition-all font-semibold text-left"
                      >
                        🧹 Send to Clean
                      </button>
                      <button
                        onClick={() => handleOverrideStatus(selectedTable.id, 'OUT_OF_SERVICE')}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-left"
                      >
                        🚫 Out of Order
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                  Select a table from the map to view details
                </div>
              )}

              {/* Bottom Quick Action */}
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Auto-refreshing live via WebSocket</span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Display System (KDS) View */}
      {activeTab === 'KDS' && (
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                Live Kitchen Display Tickets
              </h2>
              <p className="text-xs text-slate-400">Time-ordered orders from QR and floor staff</p>
            </div>
            <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-amber-300">
              Active Orders: {kitchenTickets.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kitchenTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-2xl font-black text-white tracking-tight">{ticket.table}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      #{ticket.id}
                    </span>
                  </div>

                  <div className="py-4 space-y-3">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between text-sm">
                        <div>
                          <span className="font-bold text-slate-200">{item.name}</span>
                          {item.note && (
                            <span className="block text-[11px] text-amber-400 italic">Note: {item.note}</span>
                          )}
                        </div>
                        <span className="w-6 h-6 rounded-md bg-teal-950 text-teal-300 border border-teal-800 flex items-center justify-center font-bold text-xs">
                          x{item.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Timer: <strong>{ticket.timeElapsed}</strong></span>
                  </div>

                  {ticket.status === 'NEW' ? (
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'PREPARING')}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition-all active:scale-95 shadow"
                    >
                      Start Cooking
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'READY')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow"
                    >
                      Mark Ready
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cleaning Queue View */}
      {activeTab === 'CLEANING' && (
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                Busser & Cleaning Queue
              </h2>
              <p className="text-xs text-slate-400">Oldest dirty tables prioritised to increase table turnover</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">Table T05</span>
                <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded">
                  WAITING 4m
                </span>
              </div>
              <p className="text-xs text-slate-400">Indoor Hall • 2 Seats • Previous guests completed UPI payment</p>
              <button
                onClick={() => handleOverrideStatus('t5', 'AVAILABLE')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-98"
              >
                Mark Cleaned & Reset to Available
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">Table T08</span>
                <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded">
                  IN PROGRESS (Sunil)
                </span>
              </div>
              <p className="text-xs text-slate-400">Terrace Garden • 4 Seats • Cleaning sanitisation in progress</p>
              <button
                onClick={() => handleOverrideStatus('t8', 'AVAILABLE')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-98"
              >
                Complete & Release Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

