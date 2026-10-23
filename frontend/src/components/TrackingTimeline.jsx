import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Home,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

const STAGES = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Payment verified & assigned to workshop', icon: CheckCircle2 },
  { key: 'Crafting & Inspection', label: 'Artisan Crafting', desc: 'Hand carving & mirror polishing', icon: Clock },
  { key: 'Dispatched', label: 'Dispatched', desc: 'Packed in fumigated wooden crate', icon: Package },
  { key: 'In Transit', label: 'In Transit', desc: 'Heavy freight moving via air-suspension truck', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Local delivery vehicle dispatched', icon: MapPin },
  { key: 'Delivered', label: 'Delivered', desc: 'Safely unloaded and received at doorstep', icon: Home }
];

export default function TrackingTimeline({ order }) {
  if (!order) return null;

  const currentStatus = order.order_status || 'Order Placed';

  // Determine current stage index
  const currentIndex = STAGES.findIndex(s => s.key.toLowerCase() === currentStatus.toLowerCase());
  const activeStep = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
      {/* Top Banner with Tracking info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Live Stone Consignment Tracker
            </span>
            <span className="text-xs text-stone-500 font-mono">#{order.order_number}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            Current Status: <span className="text-amber-800">{currentStatus}</span>
          </h2>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
          <p className="flex items-center gap-2 text-stone-700">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Carrier: <strong>{order.courier_name || 'SafeXpress Heavy Surface'}</strong></span>
          </p>
          <p className="flex items-center gap-2 text-stone-700 font-mono">
            <span className="font-sans">AWB No:</span>
            <strong className="text-amber-900 bg-amber-100/60 px-1.5 py-0.5 rounded">
              {order.tracking_number || 'SX-PENDING'}
            </strong>
          </p>
          {order.estimated_delivery && (
            <p className="flex items-center gap-2 text-stone-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Est. Delivery: <strong>{order.estimated_delivery}</strong></span>
            </p>
          )}
        </div>
      </div>

      {/* Current Location Highlight */}
      <div className="my-6 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 rounded-xl border border-amber-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              Last Scanned Location
            </p>
            <p className="text-sm sm:text-base font-bold text-stone-900">
              {order.current_location || 'Makrana Artisan Workshop, Rajasthan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Fumigated Wooden Crate Protection Active</span>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="py-6">
        <div className="relative">
          {/* Progress Bar Line */}
          <div className="hidden md:block absolute top-1/2 left-6 right-6 h-1 bg-stone-200 -translate-y-1/2 z-0">
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{ width: `${(activeStep / (STAGES.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Stepper Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-stone-100 text-stone-400 border border-stone-300'
                    } ${isCurrent ? 'ring-4 ring-amber-300 scale-110' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <p
                    className={`mt-2.5 text-xs font-bold ${
                      isCompleted ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5 hidden md:block max-w-[110px] leading-tight">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Chronological History Log */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <h3 className="font-serif font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
          <span>Shipment Milestone Updates (Updated by Admin)</span>
        </h3>

        {order.tracking_history && order.tracking_history.length > 0 ? (
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
            {order.tracking_history.map((entry, idx) => {
              const isLatest = idx === order.tracking_history.length - 1;
              return (
                <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                  <div
                    className={`absolute left-2 w-3.5 h-3.5 rounded-full mt-1 border-2 border-white ${
                      isLatest ? 'bg-amber-600 ring-4 ring-amber-200' : 'bg-stone-400'
                    }`}
                  ></div>

                  <div className="bg-stone-50 hover:bg-stone-100/80 p-3.5 rounded-xl border border-stone-200 flex-1 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-stone-900 flex items-center gap-2">
                        <span>{entry.status}</span>
                        <span className="text-[11px] font-normal text-stone-500">at {entry.location}</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-IN') : 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">No milestone logs recorded yet.</p>
        )}
      </div>
    </div>
  );
}
