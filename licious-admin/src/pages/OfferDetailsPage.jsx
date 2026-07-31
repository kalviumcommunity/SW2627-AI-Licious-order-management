import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { offerService } from '../services/database'

export default function OfferDetailsPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [offer, setOffer] = useState(undefined)
  useEffect(() => { let active = true; offerService.list().then(items => active && setOffer(items.find(item => String(item.id) === id) || null)); return () => { active = false } }, [id])
  if (offer === undefined) return <div className="p-10 text-center text-gray-400">Loading offer…</div>
  if (!offer) return <div className="rounded-2xl bg-white p-10 text-center text-gray-400">No data available.</div>
  const value = offer.discount_value ?? offer.discountValue
  return <div className="space-y-6 animate-fade-in-up"><div className="flex items-center gap-4 border-b border-gray-100 pb-4"><button onClick={() => navigate('/offers')} className="rounded-xl border p-2"><ArrowLeft className="h-4 w-4"/></button><div><h3 className="text-xl font-bold text-gray-800">{offer.title}</h3><p className="text-xs text-gray-400">Coupon Code: {offer.code || 'None'}</p></div></div><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border border-gray-150 bg-white p-6"><h4 className="mb-4 font-bold">Offer Overview</h4><dl className="space-y-3 text-sm"><div><dt className="text-gray-400">Offer Type</dt><dd>{offer.type}</dd></div><div><dt className="text-gray-400">Discount</dt><dd>{offer.type === 'Percentage' ? `${value}% OFF` : offer.type === 'Flat' ? `₹${value} OFF` : 'Free Delivery'}</dd></div><div><dt className="text-gray-400">Validity</dt><dd>{offer.start_date || offer.startDate} to {offer.end_date || offer.endDate}</dd></div></dl></div><div className="rounded-2xl border border-gray-150 bg-white p-6"><h4 className="mb-4 font-bold">Usage</h4><p className="text-sm text-gray-500">{offer.usage_count ?? offer.usageCount ?? 0} redemptions</p></div></div></div>
}
