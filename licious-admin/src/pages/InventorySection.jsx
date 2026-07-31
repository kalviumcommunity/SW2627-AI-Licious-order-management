import { useEffect, useMemo, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { inventoryService } from '../services/database'
import './InventorySection.css'
const status = q => q <= 0 ? 'Out of stock' : q <= 10 ? 'Low stock' : 'In stock'
export default function InventorySection() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [category, setCategory] = useState('all')
  useEffect(() => { inventoryService.list().then(setItems).finally(() => setLoading(false)) }, [])
  const categories = useMemo(() => [...new Set(items.map(i => i.category))], [items]); const visible = useMemo(() => items.filter(i => (category === 'all' || i.category === category) && (!search || i.name?.toLowerCase().includes(search.toLowerCase()))), [items, category, search])
  return <div className="inventory-section animate-fade-in-up"><div className="inventory-toolbar"><div className="inventory-search-wrap"><Search className="inventory-search-icon"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product name" className="inventory-search-input"/></div><div className="inventory-filter-group"><Filter className="w-4 h-4"/><select value={category} onChange={e => setCategory(e.target.value)} className="inventory-filter-select"><option value="all">All Categories</option>{categories.map(x => <option key={x}>{x}</option>)}</select></div></div>{loading ? <div className="inventory-empty">Loading inventory…</div> : <div className="inventory-table-card"><table className="inventory-table"><thead><tr><th>Product</th><th>Category</th><th>Stock Quantity</th><th>Stock Status</th></tr></thead><tbody>{visible.map(i => <tr key={i.id}><td className="inventory-product-name">{i.name}<span className="inventory-product-meta">{i.sku} · ₹{Number(i.price || 0).toLocaleString('en-IN')}</span></td><td>{i.category}</td><td>{i.quantity} {i.unit}</td><td>{status(i.quantity)}</td></tr>)}</tbody></table>{!visible.length && <div className="inventory-empty">No data available.</div>}</div>}</div>
}
