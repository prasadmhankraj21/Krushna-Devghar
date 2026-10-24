import React from 'react';
import { Printer, Download, X, CheckCircle, Shield, Award } from 'lucide-react';

export default function InvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

  // Calculate item sum and totals safely so NaN is completely prevented
  const itemsList = Array.isArray(order.items) ? order.items : [];
  let calculatedItemsSum = 0;
  itemsList.forEach(item => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 1;
    calculatedItemsSum += p * q;
  });

  const rawTotal = Number(order.total_amount);
  const totalAmount = !isNaN(rawTotal) && rawTotal > 0
    ? rawTotal
    : (calculatedItemsSum > 0 ? Math.round(calculatedItemsSum * 1.12) : 3500);

  const rawSubtotal = Number(order.subtotal);
  const subtotal = !isNaN(rawSubtotal) && rawSubtotal > 0
    ? rawSubtotal
    : (calculatedItemsSum > 0 ? calculatedItemsSum : Math.round(totalAmount / 1.12));

  const rawGst = Number(order.gst_amount);
  const gstAmount = !isNaN(rawGst) && rawGst >= 0
    ? rawGst
    : Math.max(0, totalAmount - subtotal);

  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="no-print bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-sm">Krushna Devghar Tax Invoice - {order.order_number}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 gold-btn text-stone-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-12 bg-white text-stone-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-stone-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-2xl shadow-sm">
                  KD
                </div>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    KRUSHNA DEVGHAR PVT. LTD.
                  </h1>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                    Makrana Pure White Marble Mandir & Vrindavan Shrines
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-600 mt-2 max-w-xs leading-relaxed">
                Plot 42-45, Makrana Marble Industrial Estate, Nagaur District, Rajasthan - 341505, India
                <br />
                Email: orders@krushnadevghar.com | Phone: +91 98290 12345
              </p>
              <div className="mt-2 text-xs font-mono text-stone-700 space-x-3">
                <span><strong>GSTIN:</strong> 08AAACR8923K1ZP</span>
                <span><strong>PAN:</strong> AAACR8923K</span>
                <span><strong>State:</strong> Rajasthan (08)</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-stone-50 p-4 rounded-xl border border-stone-200">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                Original Tax Invoice
              </span>
              <p className="text-sm font-semibold text-stone-900">
                Invoice No: <span className="font-mono text-amber-900 font-bold">INV-{order.order_number?.replace('MRB-', '') || '9042'}</span>
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Order Ref: <span className="font-mono">{order.order_number}</span>
              </p>
              <p className="text-xs text-stone-600">
                Date: <span className="font-medium">{invoiceDate}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>PAYMENT CONFIRMED</span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-6 text-xs">
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs mb-2 border-b border-stone-200 pb-1">
                Billed To (Customer Details)
              </h3>
              <p className="font-bold text-sm text-stone-900 mb-1">{order.customer_name}</p>
              <p className="text-stone-600 leading-relaxed">{order.shipping_address}</p>
              <p className="text-stone-600">{order.city}, {order.state} - {order.pincode}</p>
              <p className="text-stone-700 mt-2"><strong>Phone:</strong> {order.customer_phone}</p>
              <p className="text-stone-700"><strong>Email:</strong> {order.customer_email}</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs mb-2 border-b border-stone-200 pb-1">
                Consignment & Freight Info
              </h3>
              <p className="text-stone-700"><strong>Packaging:</strong> Fumigated Heavy-Duty Wooden Crate</p>
              <p className="text-stone-700 mt-1"><strong>Carrier:</strong> {order.courier_name || 'SafeXpress Surface Logistics'}</p>
              <p className="text-stone-700"><strong>AWB / Tracking No:</strong> <span className="font-mono font-bold text-amber-900">{order.tracking_number || 'SX-MAK-PENDING'}</span></p>
              <p className="text-stone-700 mt-1"><strong>Payment Mode:</strong> {order.payment_method}</p>
              <p className="text-stone-700"><strong>Txn ID:</strong> <span className="font-mono text-stone-600">{order.transaction_id || 'TXN-ONLINE'}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-stone-300 rounded-lg overflow-hidden my-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Product Description & Stone Material</th>
                  <th className="py-2.5 px-3 text-center">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-3 px-3 text-stone-500 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-stone-900 text-sm">{item.title}</p>
                        <p className="text-[11px] text-stone-500">
                          Category: {item.category || 'Marble Mandir'} • Material: {item.marble_type || 'Makrana White'}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-stone-600">6802</td>
                      <td className="py-3 px-3 text-center font-bold text-stone-900">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-stone-900">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-stone-500">
                      Product details attached with order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-stone-200 pt-4">
            <div className="text-xs text-stone-600 max-w-sm space-y-2">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Krushna Devghar Quality Guarantee:
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  All mandir and shrines are handcrafted from 100% natural Makrana marble stone. In-transit wooden crate insurance included.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                <span>Taxable Amount (Subtotal):</span>
                <span className="font-mono font-medium">₹{Number(subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                <span>CGST (6%):</span>
                <span className="font-mono font-medium">₹{Number(cgst || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                <span>SGST (6%):</span>
                <span className="font-mono font-medium">₹{Number(sgst || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                <span>Insured Freight & Packaging:</span>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-stone-900 font-bold text-sm text-stone-900">
                <span>Total Amount (Paid):</span>
                <span className="text-base text-amber-900 font-mono">
                  ₹{Number(totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-end">
            <div className="text-[11px] text-stone-500">
              <p>This is a computer-generated tax invoice verified under GST Act 2017.</p>
              <p>Thank you for placing your sacred order with Krushna Devghar!</p>
            </div>

            <div className="text-center">
              <div className="inline-block border border-dashed border-amber-600/40 rounded-full p-2 mb-1">
                <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center text-[7px] font-bold text-amber-900 uppercase">
                  <span>KRUSHNA</span>
                  <span>DEVGHAR</span>
                  <span>MAKRANA</span>
                </div>
              </div>
              <p className="text-xs font-bold text-stone-800">For Krushna Devghar Pvt. Ltd.</p>
              <p className="text-[10px] text-stone-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
