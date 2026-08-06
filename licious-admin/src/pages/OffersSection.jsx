import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { offerService } from '../services/database'
import { subscribeToChanges } from '../lib/socket'

export default function OffersSection() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', code: '', start_date: '', end_date: '', description: '' })

  useEffect(() => {
    const load = () => offerService.list().then(setOffers).catch(error => console.error('Unable to load offers:', error)).finally(() => setLoading(false))
    load()
    return subscribeToChanges(['offers'], load)
  }, [])

  const handleCreateOffer = async event => {
    event.preventDefault()
    if (!form.title.trim() || !form.code.trim() || !form.start_date || !form.end_date) return

    setSaving(true)
    try {
      const created = await offerService.create({
        title: form.title.trim(),
        code: form.code.trim().toUpperCase(),
        start_date: form.start_date,
        end_date: form.end_date,
        description: form.description.trim(),
        created_at: new Date().toISOString()
      })

      setOffers(previous => [created, ...previous])
      setForm({ title: '', code: '', start_date: '', end_date: '', description: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Unable to create offer:', error)
      window.alert('Could not create the offer right now.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Offers</h2>
          <p className="text-xs text-gray-400">Create and review promotions for your store.</p>
        </div>
        <button
          onClick={() => setShowForm(previous => !previous)}
          className="rounded-xl border border-[#e32929] px-3 py-2 text-sm font-semibold text-[#e32929] transition-colors hover:bg-red-50"
        >
          {showForm ? 'Cancel' : '+ Add Offer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOffer} className="rounded-2xl border border-gray-150 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-gray-600">
              <span className="mb-1 block font-semibold">Offer title</span>
              <input value={form.title} onChange={event => setForm(previous => ({ ...previous, title: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#e32929]" placeholder="Weekend Feast" required />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-1 block font-semibold">Coupon code</span>
              <input value={form.code} onChange={event => setForm(previous => ({ ...previous, code: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-[#e32929]" placeholder="FEAST10" required />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-1 block font-semibold">Start date</span>
              <input type="date" value={form.start_date} onChange={event => setForm(previous => ({ ...previous, start_date: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#e32929]" required />
            </label>
            <label className="text-sm text-gray-600">
              <span className="mb-1 block font-semibold">End date</span>
              <input type="date" value={form.end_date} onChange={event => setForm(previous => ({ ...previous, end_date: event.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#e32929]" required />
            </label>
          </div>
          <label className="mt-3 block text-sm text-gray-600">
            <span className="mb-1 block font-semibold">Description</span>
            <textarea value={form.description} onChange={event => setForm(previous => ({ ...previous, description: event.target.value }))} className="min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#e32929]" placeholder="Mention any conditions for the offer." />
          </label>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={saving} className="rounded-xl bg-[#e32929] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
              {saving ? 'Saving…' : 'Save Offer'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading offers…</div>
        ) : (
          <>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400">
                <tr>
                  <th className="p-4">Offer</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Validity</th>
                </tr>
              </thead>
              <tbody>
                {offers.map(offer => (
                  <tr key={offer.id} className="cursor-pointer border-t" onClick={() => navigate(`/offers/${offer.id}`)}>
                    <td className="p-4 font-bold text-gray-800">{offer.title}</td>
                    <td className="p-4">{offer.code}</td>
                    <td className="p-4">{offer.start_date} – {offer.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!offers.length && <div className="p-8 text-center text-gray-400">No data available.</div>}
          </>
        )}
      </div>
    </div>
  )
}

