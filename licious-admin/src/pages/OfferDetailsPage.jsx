import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  Package,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Percent,
  TrendingDown,
  ShoppingBag
} from 'lucide-react'

// Available static products list for lookup
const AVAILABLE_PRODUCTS = [
  { id: 'prod-1', name: 'Chicken Curry Cut (1 kg)', category: 'Chicken' },
  { id: 'prod-2', name: 'Chicken Seekh Kebab (250 g)', category: 'Kebabs' },
  { id: 'prod-3', name: 'Rawas Fillet (500 g)', category: 'Fish & Seafood' },
  { id: 'prod-4', name: 'Prawns Medium (500 g)', category: 'Fish & Seafood' },
  { id: 'prod-5', name: 'Chicken Tikka (500 g)', category: 'Chicken' },
  { id: 'prod-6', name: 'Chicken Biryani (1 kg)', category: 'Ready to Cook' },
  { id: 'prod-7', name: 'Mutton Curry Cut (1 kg)', category: 'Mutton' },
  { id: 'prod-8', name: 'Eggs (pack of 6)', category: 'Eggs' }
]

export default function OfferDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Load offers from localStorage
  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('licious_offers')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved offers:', e)
      }
    }
    return []
  })

  // Toast and delete modal state
  const [toast, setToast] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Find the current offer
  const offer = useMemo(() => {
    return offers.find(o => o.id === id)
  }, [offers, id])

  // Save changes to localStorage helper
  const saveOffers = (updatedOffers) => {
    setOffers(updatedOffers)
    localStorage.setItem('licious_offers', JSON.stringify(updatedOffers))
  }

  // Toast display helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Calculate status of the offer
  const getStatus = (o) => {
    if (!o) return 'Expired'
    if (o.disabled) return 'Expired' // We treat manually disabled as Expired for badge simplicity
    const now = new Date()
    const start = new Date(o.startDate)
    const end = new Date(o.endDate)
    
    now.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (o.usageLimit && o.usageCount >= o.usageLimit) {
      return 'Expired'
    }
    if (now < start) {
      return 'Scheduled'
    }
    if (now > end) {
      return 'Expired'
    }
    return 'Active'
  }

  // Toggle Offer Enabled / Disabled state
  const handleToggleStatus = () => {
    if (!offer) return
    const updated = offers.map(o => {
      if (o.id === offer.id) {
        return { ...o, disabled: !o.disabled }
      }
      return o
    })
    saveOffers(updated)
    triggerToast(
      offer.disabled ? 'Offer enabled successfully' : 'Offer disabled successfully',
      'success'
    )
  }

  // Delete Offer action
  const handleDeleteOffer = () => {
    if (!offer) return
    const updated = offers.filter(o => o.id !== offer.id)
    localStorage.setItem('licious_offers', JSON.stringify(updated))
    // We navigate back with state so OffersSection can show the deleted toast if desired
    navigate('/offers')
  }

  // Format Price helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format Date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Loading / Not found view
  if (!offer) {
    return (
      <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto mt-10 space-y-4 animate-fade-in">
        <AlertCircle className="w-16 h-16 text-[#e32929] mx-auto" />
        <h3 className="text-lg font-bold text-gray-800">Offer Not Found</h3>
        <p className="text-sm text-gray-400 font-medium">
          The selected offer could not be loaded. It may have been deleted.
        </p>
        <button
          onClick={() => navigate('/offers')}
          className="bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offers</span>
        </button>
      </div>
    )
  }

  const status = getStatus(offer)
  const isManuallyDisabled = offer.disabled

  // Calculations for detailed card progress
  const usageProgressPercent = offer.usageLimit
    ? Math.min(Math.round((offer.usageCount / offer.usageLimit) * 100), 100)
    : 0

  const redemptionRate = offer.usageLimit
    ? Math.min(Math.round((offer.usageCount / offer.usageLimit) * 100), 100)
    : 85 // Fallback representation if limit is unlimited

  // Calculate detailed products list labels
  const resolvedProducts = useMemo(() => {
    if (offer.applyToAllProducts) return 'All Products'
    if (offer.applicableProducts && offer.applicableProducts.length > 0) {
      return offer.applicableProducts
        .map(id => AVAILABLE_PRODUCTS.find(p => p.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    }
    if (offer.applicableCategories && offer.applicableCategories.length > 0) {
      return `All Products in Category: ${offer.applicableCategories.join(', ')}`
    }
    return 'None'
  }, [offer])

  // Custom static Timeline history events
  const timelineEvents = useMemo(() => {
    const events = [
      {
        title: 'Promotion Created',
        desc: 'Offer template saved by administrator (admin@dev.licious.com)',
        date: formatDate(offer.startDate),
        time: '10:00 AM',
        icon: Tag,
        color: 'text-[#e32929] bg-red-50'
      }
    ]

    const start = new Date(offer.startDate)
    start.setDate(start.getDate() + 1)
    
    events.push({
      title: 'Status Activated',
      desc: 'Offer marked active and visible on checkout systems',
      date: formatDate(offer.startDate),
      time: '12:00 PM',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50'
    })

    if (offer.usageCount > 0) {
      events.push({
        title: 'First Coupon Redemption',
        desc: 'Customer placed order using coupon code successfully',
        date: formatDate(offer.startDate),
        time: '02:45 PM',
        icon: ShoppingBag,
        color: 'text-indigo-600 bg-indigo-50'
      })
    }

    if (offer.usageLimit && offer.usageCount >= offer.usageLimit * 0.5) {
      events.push({
        title: '50% Allocation Threshold',
        desc: `Redemption progress reached half of limit (${offer.usageCount}/${offer.usageLimit})`,
        date: formatDate(new Date().toISOString()),
        time: 'Just now',
        icon: TrendingUp,
        color: 'text-amber-600 bg-amber-50'
      })
    }

    if (isManuallyDisabled) {
      events.push({
        title: 'Manually Disabled',
        desc: 'Offer status suspended by admin action',
        date: 'Today',
        time: 'Just now',
        icon: PauseCircle,
        color: 'text-rose-600 bg-rose-50'
      })
    }

    return events
  }, [offer, isManuallyDisabled])

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 relative">
      {/* Toast Alert popup */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-fade-in bg-emerald-50 text-emerald-800 border-emerald-100">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-150 animate-scale-up space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Delete Offer</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Are you sure you want to delete this offer? This will permanently remove the record of this coupon code, and it will immediately stop working.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOffer}
                className="px-4 py-2 bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button and page Title header */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <button
          onClick={() => navigate('/offers')}
          className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-800">{offer.title}</h3>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
              status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
              'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-semibold font-mono uppercase tracking-wider">
            Coupon Code: {offer.code || 'None'}
          </p>
        </div>
      </div>

      {/* Row 2: Actions button toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white border border-gray-150 p-4 rounded-2xl shadow-2xs">
        <div className="flex flex-wrap gap-2">
          {/* Edit Offer button */}
          <button
            onClick={() => navigate(`/offers?edit=${offer.id}`)}
            className="flex items-center gap-2 bg-[#e32929] hover:bg-[#c41f1f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Offer</span>
          </button>

          {/* Toggle status suspend button */}
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
              isManuallyDisabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50'
            }`}
          >
            {isManuallyDisabled ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            <span>{isManuallyDisabled ? 'Enable Offer' : 'Disable Offer'}</span>
          </button>
        </div>

        {/* Delete Offer button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Offer</span>
        </button>
      </div>

      {/* Row 3: Grid content details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Overview & Products */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main settings card */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2.5">
              Offer Overview & Target Criteria
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
              
              {/* Type Detail */}
              <div className="space-y-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Offer Type</span>
                <span className="block font-bold text-gray-800 text-sm">{offer.type}</span>
              </div>

              {/* Discount Value */}
              <div className="space-y-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Discount Value</span>
                <span className="block font-black text-[#e32929] text-base">
                  {offer.type === 'Percentage' ? `${offer.discountValue}% OFF` :
                   offer.type === 'Flat' ? `₹${offer.discountValue} OFF` :
                   'Free Delivery'}
                </span>
              </div>

              {/* Max Discount Limit */}
              <div className="space-y-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Max Discount Limit</span>
                <span className="block font-bold text-gray-800 text-sm">
                  {offer.type === 'Percentage' ? formatPrice(offer.maxDiscount) : 'Not Applicable'}
                </span>
              </div>

              {/* Min Order Value */}
              <div className="space-y-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Min. Order Requirement</span>
                <span className="block font-bold text-gray-800 text-sm">
                  {offer.minOrderValue ? formatPrice(offer.minOrderValue) : 'No Minimum Order'}
                </span>
              </div>

              {/* Validity period dates */}
              <div className="space-y-1 md:col-span-2">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Validity Period</span>
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(offer.startDate)}</span>
                  <span className="text-gray-400 font-medium">to</span>
                  <span>{formatDate(offer.endDate)}</span>
                </div>
              </div>

              {/* Applicable Categories */}
              <div className="space-y-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Target Categories</span>
                <span className="block font-bold text-gray-800">
                  {offer.applicableCategories && offer.applicableCategories.length > 0
                    ? offer.applicableCategories.join(', ')
                    : 'All Categories'}
                </span>
              </div>

              {/* Applicable Products */}
              <div className="space-y-1 md:col-span-2 border-t border-gray-55 pt-3 mt-1">
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Applicable Products</span>
                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl max-h-32 overflow-y-auto custom-scrollbar font-bold text-gray-600 leading-relaxed">
                  {resolvedProducts}
                </div>
              </div>

            </div>
          </div>

          {/* Performance & Revenue stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Revenue Generated */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Revenue Impact</span>
              <h5 className="text-xl font-black text-gray-800">{formatPrice(offer.revenueGenerated || 0)}</h5>
              <p className="text-[10px] text-gray-400 font-semibold">Total sales using offer</p>
            </div>

            {/* Total Customers */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Customers Benefited</span>
              <h5 className="text-xl font-black text-gray-800">{offer.customersBenefited || 0}</h5>
              <p className="text-[10px] text-gray-400 font-semibold">Unique active checkouts</p>
            </div>

            {/* Redemption Rate */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Redemption Rate</span>
              <h5 className="text-xl font-black text-gray-800">{redemptionRate}%</h5>
              <p className="text-[10px] text-gray-400 font-semibold">Redemption allocation rate</p>
            </div>

          </div>

        </div>

        {/* Col 3: Side panels (Usage progress and timeline) */}
        <div className="space-y-6">
          
          {/* Usage limit card */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-[10px] text-gray-400">
              Redemption Allocation
            </h4>
            
            {offer.usageLimit ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800">{offer.usageCount} of {offer.usageLimit} Used</span>
                  <span className="text-[#e32929]">{usageProgressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'Expired' ? 'bg-rose-500' :
                      usageProgressPercent >= 90 ? 'bg-rose-500' :
                      usageProgressPercent >= 70 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${usageProgressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-semibold pt-1">
                  Once usage limit is reached, this offer automatically suspends and changes to expired.
                </p>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <span className="block text-sm font-extrabold text-emerald-600">Unlimited Usage Cap</span>
                <p className="text-[10px] text-gray-400 font-semibold">
                  This coupon has no budget limit and remains active until manually disabled or expiration date passes.
                </p>
              </div>
            )}
          </div>

          {/* Activity Log / History timeline */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              Activity History Log
            </h4>
            
            {/* Vertical timeline items */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {timelineEvents.map((ev, index) => (
                <div key={index} className="relative text-xs">
                  {/* Circle Icon Badge node */}
                  <span className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border border-white flex items-center justify-center flex-shrink-0 ${ev.color}`}>
                    <ev.icon className="w-3.5 h-3.5" />
                  </span>
                  
                  {/* Body details */}
                  <div className="space-y-0.5 pl-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{ev.title}</span>
                      <span className="text-[10px] text-gray-400 font-semibold font-mono">{ev.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{ev.desc}</p>
                    <span className="block text-[10px] text-gray-400 font-bold font-mono pt-0.5">{ev.date}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
