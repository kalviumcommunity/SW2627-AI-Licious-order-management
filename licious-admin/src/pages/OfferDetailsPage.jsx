import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { offerService } from '../services/database'
export default function OfferDetailsPage() {
 const { id } = useParams(); const navigate = useNavigate(); const [offer, setOffer] = useState(undefined)
 useEffect(() => { offerService.list().then(items => setOffer(items.find(x => String(x.id) === id) || null)) }, [id])
 if (offer === undefined) return <div className="p-10 text-center text-gray-400">Loading offer…</div>
 if (!offer) return <div className="rounded-2xl bg-white p-10 text-center text-gray-400">No data available.</div>
 return <div className="space-y-6"><button onClick={() => navigate('/offers')} className="rounded-xl border p-2"><ArrowLeft className="h-4 w-4"/></button><div className="rounded-2xl border border-gray-150 bg-white p-6"><h2 className="text-xl font-bold">{offer.title}</h2><p className="mt-2 text-sm text-gray-500">Coupon code: {offer.code || 'None'}</p><p className="mt-2 text-sm">{offer.start_date} to {offer.end_date}</p></div></div>
}
