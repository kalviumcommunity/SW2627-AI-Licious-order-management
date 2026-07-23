import { useMemo } from 'react'
import {
  ArrowLeft,
  Printer,
  Download,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react'

export default function OrderDetailsPage({ orderId, orders, onUpdateStatus }) {
  // Find current order
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId)
  }, [orders, orderId])

  if (!order) {
    return (
      <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
        <XCircle className="w-16 h-16 text-[#e32929] mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800">Order Not Found</h3>
        <p className="text-sm text-gray-400 mt-2 font-medium">
          The order ID <strong>{orderId}</strong> could not be found in our records.
        </p>
      </div>
    )
  }

  // Define steps for the timeline
  const timelineSteps = [
    { label: 'Order Placed', statusKey: 'Placed' },
    { label: 'Order Accepted', statusKey: 'Accepted' },
    { label: 'Preparing', statusKey: 'Preparing' },
    { label: 'Ready for Pickup', statusKey: 'Ready' },
    { label: 'Picked Up', statusKey: 'PickedUp' },
    { label: 'Delivered', statusKey: 'Delivered' }
  ]

  // Map order status to progress index
  // 0: Placed, 1: Accepted, 2: Preparing, 3: Ready, 4: PickedUp, 5: Delivered
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'New':
        return 1 // Placed and Accepted are done
      case 'Preparing':
        return 2 // Preparing is done
      case 'Ready':
        return 3 // Ready for Pickup is done
      case 'Delivered':
        return 5 // Delivered is done
      default:
        return -1
    }
  }

  const activeStepIndex = getActiveStepIndex(order.status)
  const isCancelled = order.status === 'Cancelled'

  // Back button navigation logic matching status
  const handleBack = () => {
    // If order is delivered or cancelled, go to completed-orders tab
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      window.history.pushState({}, '', '/completed-orders')
      // Dispatch popstate to update App router
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else {
      window.history.pushState({}, '', '/live-orders')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // Mock CSV or print trigger for invoice download
    const invoiceContent = `Order ID,Customer Name,Phone,Address,Total Price,Status,Date\n${order.id},${order.customerName},${order.phone},"${order.address || ''}",${order.price},${order.status},"${order.date || ''}"`
    const blob = new Blob([invoiceContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `invoice_${order.id}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate items unit summary
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCharges = 49
  const tax = Math.round(subtotal * 0.05) // 5% GST
  const estimatedTotal = subtotal + deliveryCharges + tax

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── PRINT-ONLY INVOICE HEADER ── */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-gray-300 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#e32929]">Licious</h1>
          <p className="text-xs text-gray-500 mt-1 font-semibold">Official Order Invoice</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold text-gray-800">Invoice ID: INV-{order.id.slice(4)}</h3>
          <p className="text-xs text-gray-500 mt-1 font-semibold">Date: {order.date || 'N/A'}</p>
        </div>
      </div>

      {/* ── TOP ACTION HEADER BAR (Hidden during printing) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full shadow-sm transition-all"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Order {order.id}</h2>
              {isCancelled ? (
                <span className="px-3 py-1 rounded-md text-[10px] font-extrabold bg-red-50 text-red-600 uppercase tracking-wide border border-red-100">
                  Cancelled
                </span>
              ) : (
                <span
                  className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                    order.status === 'New'
                      ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100'
                      : order.status === 'Preparing'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : order.status === 'Ready'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-green-50 text-green-600 border-green-100'
                  }`}
                >
                  {order.status === 'Ready' ? 'Ready for Pickup' : order.status}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              Placed on {order.date || 'N/A'} • {order.items.length} unique items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-gray-400" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-gray-400" />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* ── TIMELINE TRACKER CARD ── */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-gray-800 mb-6 uppercase tracking-wider">Order Progress</h3>
        
        {isCancelled ? (
          <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-xl p-4.5 text-red-700">
            <XCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">This order was Cancelled</p>
              <p className="text-xs text-red-500 mt-0.5 font-semibold">It is no longer active and cannot be processed.</p>
            </div>
          </div>
        ) : (
          /* Stepper Wrapper */
          <div className="relative">
            {/* Desktop Stepper (Horizontal) */}
            <div className="hidden md:flex items-center justify-between relative z-10">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= activeStepIndex
                const isCurrent = idx === activeStepIndex
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center text-center group relative">
                    {/* Connecting line to the next item */}
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-[50%] right-[-50%] h-0.5 -z-10 transition-colors duration-500 ${
                          idx < activeStepIndex ? 'bg-[#e32929]' : 'bg-gray-150'
                        }`}
                      />
                    )}
                    
                    {/* Stepper Node Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#e32929] border-[#e32929] text-white'
                          : 'bg-white border-gray-200 text-gray-300'
                      } ${isCurrent ? 'ring-4 ring-red-50 scale-110' : ''}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5.5 h-5.5" />
                      ) : (
                        <span className="text-xs font-extrabold">{idx + 1}</span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-bold mt-3 max-w-[100px] truncate ${
                        isCompleted ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Mobile Stepper (Vertical) */}
            <div className="flex md:hidden flex-col gap-6 pl-4 relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-150">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= activeStepIndex
                const isCurrent = idx === activeStepIndex
                return (
                  <div key={idx} className="flex items-center gap-4 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#e32929] border-[#e32929] text-white'
                          : 'bg-white border-gray-200 text-gray-300'
                      } ${isCurrent ? 'ring-4 ring-red-50 scale-105' : ''}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      ) : (
                        <span className="text-[10px] font-extrabold">{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── TWO COLUMN INFO LAYOUT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Order & Customer Details (2 Cols on desktop) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Order Details & Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Order Information */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3.5 border-b border-gray-50">
                <FileText className="w-5 h-5 text-gray-400" />
                <h4 className="font-bold text-gray-800 text-sm">Order Summary</h4>
              </div>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold text-gray-700">
                <span className="text-gray-400">Order ID</span>
                <span className="text-gray-900 font-extrabold">{order.id}</span>
                
                <span className="text-gray-400">Date & Time</span>
                <span className="text-gray-900">{order.date || 'N/A'}</span>

                <span className="text-gray-400">Payment Status</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase max-w-max ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-green-50 text-green-600 border-green-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {order.paymentStatus || 'Paid'}
                </span>

                <span className="text-gray-400">Payment Method</span>
                <div className="flex items-center gap-1.5 text-gray-900">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.paymentMethod || 'UPI'}</span>
                </div>

                <span className="text-gray-400">Total Amount</span>
                <span className="text-[#e32929] font-extrabold text-sm">₹{order.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Card 2: Customer Details */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3.5 border-b border-gray-50">
                <User className="w-5 h-5 text-gray-400" />
                <h4 className="font-bold text-gray-800 text-sm">Customer Details</h4>
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-[#e32929] flex items-center justify-center font-bold">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Customer Profile Verified</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.phone}</span>
                </div>

                <div className="flex items-start gap-2 text-gray-700 font-semibold leading-relaxed font-sans">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{order.address || 'Prestige Shantiniketan, Whitefield, Bengaluru 560048'}</span>
                </div>

                {order.deliveryInstructions && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-500 leading-normal">
                    <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Instructions</p>
                    <p className="text-[11px] font-semibold mt-1 italic font-serif">"{order.deliveryInstructions}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Ordered Items Table */}
          <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Ordered Items</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-extrabold uppercase border-b border-gray-100">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-4 text-center">Quantity</th>
                    <th className="py-3.5 px-4 text-right">Unit Price</th>
                    <th className="py-3.5 px-6 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-800">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm"
                        />
                        <span className="font-bold text-gray-900">{item.name}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600 font-extrabold">
                        {item.quantity || 1}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        ₹{(item.price || Math.round(order.price / (order.items.length || 1))).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-gray-900">
                        ₹{((item.price || Math.round(order.price / (order.items.length || 1))) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown Summary */}
            <div className="bg-gray-50/30 border-t border-gray-100 p-6 flex justify-end">
              <div className="w-64 space-y-2.5 text-xs font-semibold text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{(order.price - 49).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="text-gray-800">₹49</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="text-gray-800">₹{Math.round((order.price - 49) * 0.05).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-sm font-extrabold text-gray-900">
                  <span>Estimated Total</span>
                  <span className="text-[#e32929]">₹{order.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Delivery Info & Actions (1 Col on desktop) */}
        <div className="space-y-6">
          {/* Card 4: Delivery Information */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3.5 border-b border-gray-50">
              <Truck className="w-5 h-5 text-gray-400" />
              <h4 className="font-bold text-gray-800 text-sm">Delivery Information</h4>
            </div>
            
            {order.deliveryPartner ? (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold">
                    {order.deliveryPartner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{order.deliveryPartner.name}</p>
                    <p className="text-[10px] text-green-500 font-bold mt-0.5">Assigned Rider</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.deliveryPartner.phone}</span>
                </div>

                <div className="flex items-center gap-2.5 text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Estimated prep/eta: <strong className="text-gray-900 font-extrabold">{order.deliveryPartner.estTime}</strong></span>
                </div>

                <div className="bg-green-50/50 border border-green-100 rounded-xl p-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 text-xs font-bold">Rider Status: {order.deliveryPartner.status}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-gray-400 font-bold">No delivery partner assigned yet.</p>
                <button className="text-xs font-bold text-[#e32929] hover:underline">
                  Assign Partner Now
                </button>
              </div>
            )}
          </div>

          {/* Card 5: Update Order Status (For Live Orders Only) - Hidden during printing */}
          {!isCancelled && order.status !== 'Delivered' && (
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4 print:hidden">
              <div className="flex items-center gap-2 pb-3.5 border-b border-gray-50">
                <Clock className="w-5 h-5 text-gray-400" />
                <h4 className="font-bold text-gray-800 text-sm">Update Order Status</h4>
              </div>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                Advance this order through the queue. Customers are notified of status updates.
              </p>
              <div className="flex flex-col gap-2.5 pt-2">
                {order.status === 'New' && (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'Preparing')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#e32929] hover:bg-[#c41f1f] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Mark as Preparing</span>
                  </button>
                )}

                {order.status === 'Preparing' && (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'Ready')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Mark as Ready for Pickup</span>
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'Delivered')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Mark as Delivered</span>
                  </button>
                )}

                <button
                  onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-red-50 text-[#e32929] border border-red-200 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Order</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
