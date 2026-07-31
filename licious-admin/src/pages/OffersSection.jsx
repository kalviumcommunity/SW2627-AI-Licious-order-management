import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { offerService } from '../services/database'
export default function OffersSection() {
  const navigate = useNavigate(); const [offers, setOffers] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { offerService.list().then(setOffers).finally(() => setLoading(false)) }, [])
  return <div className="space-y-6 animate-fade-in-up"><div><h2 className="text-xl font-bold text-gray-900">Offers</h2><p className="text-xs text-gray-400">View active promotions.</p></div><div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm">{loading ? <div className="p-8 text-center text-gray-400">Loading offers…</div> : <table className="w-full text-left text-xs"><thead className="bg-gray-50 text-gray-400"><tr><th className="p-4">Offer</th><th className="p-4">Code</th><th className="p-4">Validity</th></tr></thead><tbody>{offers.map(o => <tr key={o.id} className="cursor-pointer border-t" onClick={() => navigate(`/offers/${o.id}`)}><td className="p-4 font-bold">{o.title}</td><td className="p-4">{o.code}</td><td className="p-4">{o.start_date} – {o.end_date}</td></tr>)}</tbody></table>}{!loading && !offers.length && <div className="p-8 text-center text-gray-400">No data available.</div>}</div></div>
}
