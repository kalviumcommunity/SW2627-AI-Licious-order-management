import { useMemo, useState } from 'react'
import { Search, Filter, Plus, Pencil, Trash2 } from 'lucide-react'
import './InventorySection.css'

import chickenCurryImg from '../assets/chicken_curry.jpg'
import chickenKebabImg from '../assets/chicken_kebab.jpg'
import rawasFilletImg from '../assets/rawas_fillet.jpg'
import chickenTikkaImg from '../assets/chicken_tikka.jpg'
import chickenBiryaniImg from '../assets/chicken_biryani.jpg'

const INITIAL_INVENTORY = [
  {
    id: 1,
    name: 'Chicken Curry Cut',
    category: 'Chicken',
    sku: 'CHK-CC-001',
    price: 450,
    quantity: 120,
    unit: 'kg',
    status: 'In stock',
    image: chickenCurryImg,
  },
  {
    id: 2,
    name: 'Chicken Breast Boneless',
    category: 'Chicken',
    sku: 'CHK-BB-002',
    price: 520,
    quantity: 45,
    unit: 'kg',
    status: 'In stock',
    image: chickenKebabImg,
  },
  {
    id: 3,
    name: 'Mutton Curry Cut',
    category: 'Mutton',
    sku: 'MTN-CC-003',
    price: 780,
    quantity: 130,
    unit: 'kg',
    status: 'In stock',
    image: chickenTikkaImg,
  },
  {
    id: 4,
    name: 'Fish Tikka Steak',
    category: 'Sea Food',
    sku: 'FSH-TT-004',
    price: 650,
    quantity: 20,
    unit: 'kg',
    status: 'Low stock',
    image: rawasFilletImg,
  },
  {
    id: 5,
    name: 'Eggs (pack of 6)',
    category: 'Eggs',
    sku: 'EGG-P6-005',
    price: 89,
    quantity: 0,
    unit: 'kg',
    status: 'Out of stock',
    image: chickenBiryaniImg,
  },
]

function StockStatusBadge({ status }) {
  const styles = {
    'In stock': 'inventory-status--in-stock',
    'Low stock': 'inventory-status--low-stock',
    'Out of stock': 'inventory-status--out-of-stock',
  }

  return (
    <span className={`inventory-status ${styles[status] || ''}`}>
      {status}
    </span>
  )
}

export default function InventorySection() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showFilter, setShowFilter] = useState(false)

  const categories = useMemo(() => {
    return [...new Set(inventory.map((item) => item.category))]
  }, [inventory])

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [inventory, searchQuery, categoryFilter])

  const handleDelete = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id))
  }

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="inventory-section animate-fade-in-up">
      {/* Toolbar: search, filter, add product */}
      <div className="inventory-toolbar">
        <div className="inventory-search-wrap">
          <Search className="inventory-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name"
            className="inventory-search-input"
          />
        </div>

        <div className="inventory-toolbar-actions">
          <div className="inventory-filter-group">
            <button
              type="button"
              onClick={() => setShowFilter((prev) => !prev)}
              className="inventory-filter-btn"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {showFilter && (
              <>
                <div
                  className="inventory-filter-backdrop"
                  onClick={() => setShowFilter(false)}
                />
                <div className="inventory-filter-dropdown">
                  <p className="inventory-filter-label">Category</p>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="inventory-filter-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <button type="button" className="inventory-add-btn">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Desktop table — columns match Figma reference */}
      <div className="inventory-table-card hidden md:block">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock Quantity</th>
              <th>Stock Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="inventory-product-cell">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="inventory-product-img"
                    />
                    <div>
                      <span className="inventory-product-name">{item.name}</span>
                      <span className="inventory-product-meta">
                        {item.sku} · {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="inventory-cell-text">{item.category}</td>
                <td className="inventory-cell-text">
                  {item.quantity} {item.unit}
                </td>
                <td>
                  <StockStatusBadge status={item.status} />
                </td>
                <td>
                  <div className="inventory-action-group">
                    <button type="button" className="inventory-update-btn">
                      Update Stock
                    </button>
                    <button
                      type="button"
                      className="inventory-icon-btn inventory-icon-btn--edit"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="inventory-icon-btn inventory-icon-btn--delete"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="inventory-empty">
            {inventory.length === 0 ? 'No inventory items found' : 'No products match your search.'}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="inventory-mobile-list md:hidden">
        {filteredInventory.map((item) => (
          <div key={item.id} className="inventory-mobile-card">
            <div className="inventory-mobile-header">
              <div className="inventory-product-cell">
                <img
                  src={item.image}
                  alt={item.name}
                  className="inventory-product-img"
                />
                <div>
                  <p className="inventory-product-name">{item.name}</p>
                  <p className="inventory-mobile-sku">{item.sku}</p>
                </div>
              </div>
              <StockStatusBadge status={item.status} />
            </div>

            <div className="inventory-mobile-details">
              <div>
                <span className="inventory-mobile-label">Category</span>
                <span>{item.category}</span>
              </div>
              <div>
                <span className="inventory-mobile-label">Price</span>
                <span>{formatPrice(item.price)}</span>
              </div>
              <div>
                <span className="inventory-mobile-label">Quantity</span>
                <span>
                  {item.quantity} {item.unit}
                </span>
              </div>
            </div>

            <div className="inventory-mobile-actions">
              <button type="button" className="inventory-update-btn inventory-update-btn--full">
                Update Stock
              </button>
              <button
                type="button"
                className="inventory-icon-btn inventory-icon-btn--edit"
                aria-label={`Edit ${item.name}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="inventory-icon-btn inventory-icon-btn--delete"
                aria-label={`Delete ${item.name}`}
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredInventory.length === 0 && (
          <div className="inventory-empty">
            {inventory.length === 0 ? 'No inventory items found' : 'No products match your search.'}
          </div>
        )}
      </div>
    </div>
  )
}
