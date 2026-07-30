import { useState, useMemo, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Grid, 
  List, 
  X, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  FileText 
} from 'lucide-react'
import './ProductsSection.css'

// Import assets
import chickenCurryImg from '../assets/chicken_curry.jpg'
import chickenKebabImg from '../assets/chicken_kebab.jpg'
import rawasFilletImg from '../assets/rawas_fillet.jpg'
import chickenTikkaImg from '../assets/chicken_tikka.jpg'
import chickenBiryaniImg from '../assets/chicken_biryani.jpg'
import prawnsMediumImg from '../assets/prawns_medium.jpg'

const IMAGE_MAP = {
  'chicken_curry.jpg': chickenCurryImg,
  'chicken_kebab.jpg': chickenKebabImg,
  'rawas_fillet.jpg': rawasFilletImg,
  'chicken_tikka.jpg': chickenTikkaImg,
  'chicken_biryani.jpg': chickenBiryaniImg,
  'prawns_medium.jpg': prawnsMediumImg,
}

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Chicken Curry Cut (1 kg)',
    category: 'Chicken',
    sku: 'CHK-CC-001',
    price: 450,
    unit: 'kg',
    description: 'Fresh tender chicken curry cut bone-in pieces, perfect for home-style chicken curries.',
    status: 'Active',
    imageName: 'chicken_curry.jpg'
  },
  {
    id: 'prod-2',
    name: 'Chicken Seekh Kebab (250 g)',
    category: 'Kebabs',
    sku: 'CHK-SK-002',
    price: 600,
    unit: 'pack',
    description: 'Delectable chicken seekh kebabs seasoned with aromatic spices, ready to grill or fry.',
    status: 'Active',
    imageName: 'chicken_kebab.jpg'
  },
  {
    id: 'prod-3',
    name: 'Rawas Fillet (500 g)',
    category: 'Fish & Seafood',
    sku: 'FSH-RF-003',
    price: 500,
    unit: 'pack',
    description: 'Freshly cut premium Rawas (Indian Salmon) steaks, rich in Omega-3.',
    status: 'Out of Stock',
    imageName: 'rawas_fillet.jpg'
  },
  {
    id: 'prod-4',
    name: 'Prawns Medium (500 g)',
    category: 'Fish & Seafood',
    sku: 'FSH-PM-004',
    price: 250,
    unit: 'pack',
    description: 'Deshelled and deveined medium prawns, perfect for delicious prawn curry or stir-fry.',
    status: 'Active',
    imageName: 'prawns_medium.jpg'
  },
  {
    id: 'prod-5',
    name: 'Chicken Tikka (500 g)',
    category: 'Chicken',
    sku: 'CHK-TK-005',
    price: 350,
    unit: 'pack',
    description: 'Succulent chicken breast chunks marinated in spicy yogurt marinade, ready to roast.',
    status: 'Draft',
    imageName: 'chicken_tikka.jpg'
  },
  {
    id: 'prod-6',
    name: 'Chicken Biryani (1 kg)',
    category: 'Ready to Cook',
    sku: 'RTC-CB-006',
    price: 370,
    unit: 'kg',
    description: 'Ready-to-cook classic Chicken Biryani kit with high quality basmati rice and pre-marinated chicken.',
    status: 'Active',
    imageName: 'chicken_biryani.jpg'
  }
]

export default function ProductsSection() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('licious_products')
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
  })

  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Form State for Adding
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Chicken',
    sku: '',
    price: '',
    unit: 'kg',
    description: '',
    status: 'Active',
    imageName: 'chicken_curry.jpg'
  })

  // Persist Products to LocalStorage
  useEffect(() => {
    localStorage.setItem('licious_products', JSON.stringify(products))
  }, [products])

  // Get unique categories
  const categories = useMemo(() => {
    return ['Chicken', 'Kebabs', 'Fish & Seafood', 'Ready to Cook', 'Mutton', 'Eggs']
  }, [])

  // Calculate Product statistics
  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'Active').length,
      draft: products.filter(p => p.status === 'Draft').length,
      outOfStock: products.filter(p => p.status === 'Out of Stock').length
    }
  }, [products])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchQuery, categoryFilter, statusFilter])

  // Handle Add Product
  const handleAddProduct = (e) => {
    e.preventDefault()
    const productToAdd = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      price: parseFloat(newProduct.price) || 0
    }
    setProducts(prev => [productToAdd, ...prev])
    setIsAddModalOpen(false)
    setNewProduct({
      name: '',
      category: 'Chicken',
      sku: '',
      price: '',
      unit: 'kg',
      description: '',
      status: 'Active',
      imageName: 'chicken_curry.jpg'
    })
  }

  // Handle Edit Product
  const handleEditProduct = (e) => {
    e.preventDefault()
    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...editingProduct,
          price: parseFloat(editingProduct.price) || 0
        }
      }
      return p
    }))
    setEditingProduct(null)
  }

  // Handle Delete Product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product from the catalog?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'prod-status--active'
      case 'Draft':
        return 'prod-status--draft'
      case 'Out of Stock':
        return 'prod-status--outofstock'
      default:
        return ''
    }
  }

  return (
    <div className="products-section animate-fade-in-up">
      
      {/* ── Metric Cards ── */}
      <div className="products-stats-grid">
        <div className="prod-stat-card">
          <div className="prod-stat-icon-wrap bg-red-50 text-[#e32929]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="prod-stat-label">Total Products</span>
            <h3 className="prod-stat-value">{stats.total}</h3>
          </div>
        </div>

        <div className="prod-stat-card">
          <div className="prod-stat-icon-wrap bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="prod-stat-label">Active Catalog</span>
            <h3 className="prod-stat-value text-emerald-600">{stats.active}</h3>
          </div>
        </div>

        <div className="prod-stat-card">
          <div className="prod-stat-icon-wrap bg-amber-50 text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="prod-stat-label">Draft / New</span>
            <h3 className="prod-stat-value text-amber-600">{stats.draft}</h3>
          </div>
        </div>

        <div className="prod-stat-card">
          <div className="prod-stat-icon-wrap bg-rose-50 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="prod-stat-label">Out of Stock</span>
            <h3 className="prod-stat-value text-rose-600">{stats.outOfStock}</h3>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search, Filters, Add Button ── */}
      <div className="products-toolbar">
        <div className="products-search-wrap">
          <Search className="products-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, SKU, description..."
            className="products-search-input"
          />
        </div>

        <div className="products-toolbar-actions">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="products-select-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="products-select-filter"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* View Mode Toggle */}
          <div className="products-view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`products-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`products-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Product Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="products-add-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ── Product List Layouts ── */}
      {filteredProducts.length === 0 ? (
        <div className="products-empty-state">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-gray-700 font-bold">No Products Found</h3>
          <p className="text-gray-400 mt-1">Try modifying your search query or filter settings.</p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* ──── GRID LAYOUT ──── */
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-card-img-wrap">
                <img 
                  src={IMAGE_MAP[product.imageName] || chickenCurryImg} 
                  alt={product.name} 
                  className="product-card-img"
                />
                <span className={`product-status-badge ${getStatusBadgeClass(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="product-card-content">
                <div className="product-card-meta">
                  <span className="product-card-category">{product.category}</span>
                  <span className="product-card-sku">{product.sku}</span>
                </div>
                
                <h4 className="product-card-title">{product.name}</h4>
                <p className="product-card-desc">{product.description || 'No description available.'}</p>
                
                <div className="product-card-footer">
                  <div className="product-card-price-wrap">
                    <span className="product-card-price">{formatPrice(product.price)}</span>
                    <span className="product-card-unit">/ {product.unit}</span>
                  </div>
                  
                  <div className="product-card-actions">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="product-action-btn edit"
                      title="Edit Product"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="product-action-btn delete"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        /* ──── TABLE LAYOUT ──── */
        <div className="products-table-card hidden md:block">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product-cell">
                      <img 
                        src={IMAGE_MAP[product.imageName] || chickenCurryImg} 
                        alt={product.name} 
                        className="table-product-img"
                      />
                      <div>
                        <span className="table-product-name">{product.name}</span>
                        <span className="table-product-sku">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-text-category">{product.category}</span>
                  </td>
                  <td>
                    <span className="table-text-price">{formatPrice(product.price)} / {product.unit}</span>
                  </td>
                  <td>
                    <span className={`table-status-pill ${getStatusBadgeClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <span className="table-text-desc" title={product.description}>
                      {product.description || '-'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="table-action-btn edit"
                        title="Edit Product"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="table-action-btn delete"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile list view layout when viewMode is table */}
      {viewMode === 'table' && (
        <div className="products-mobile-list md:hidden">
          {filteredProducts.map(product => (
            <div key={product.id} className="mobile-product-card">
              <div className="mobile-product-header">
                <div className="mobile-product-info">
                  <img 
                    src={IMAGE_MAP[product.imageName] || chickenCurryImg} 
                    alt={product.name} 
                    className="mobile-product-img"
                  />
                  <div>
                    <h4 className="mobile-product-title">{product.name}</h4>
                    <span className="mobile-product-sku">{product.sku}</span>
                  </div>
                </div>
                <span className={`product-status-badge ${getStatusBadgeClass(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="mobile-product-details">
                <div className="mobile-detail-row">
                  <span>Category</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                <div className="mobile-detail-row">
                  <span>Price</span>
                  <span className="font-semibold text-gray-800">{formatPrice(product.price)} / {product.unit}</span>
                </div>
                <div className="mobile-detail-row">
                  <span>Description</span>
                  <span className="mobile-detail-desc">{product.description || '-'}</span>
                </div>
              </div>
              
              <div className="mobile-product-actions">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="mobile-action-btn edit"
                >
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="mobile-action-btn delete"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: ADD PRODUCT ── */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Add New Product</h4>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Fresh Chicken Breasts"
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={e => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g. CHK-BR-007"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.price}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="450"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit type *</label>
                  <select
                    value={newProduct.unit}
                    onChange={e => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                    className="form-select"
                  >
                    <option value="kg">kg</option>
                    <option value="pack">pack</option>
                    <option value="g">g</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    value={newProduct.status}
                    onChange={e => setNewProduct(prev => ({ ...prev, status: e.target.value }))}
                    className="form-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image Template *</label>
                <select
                  value={newProduct.imageName}
                  onChange={e => setNewProduct(prev => ({ ...prev, imageName: e.target.value }))}
                  className="form-select"
                >
                  <option value="chicken_curry.jpg">Chicken Curry Template</option>
                  <option value="chicken_kebab.jpg">Chicken Kebab Template</option>
                  <option value="rawas_fillet.jpg">Rawas Fillet Template</option>
                  <option value="chicken_tikka.jpg">Chicken Tikka Template</option>
                  <option value="chicken_biryani.jpg">Chicken Biryani Template</option>
                  <option value="prawns_medium.jpg">Prawns Medium Template</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product details, taste, portion size..."
                  rows="3"
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="form-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-submit-btn"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PRODUCT ── */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h4 className="modal-title">Edit Product Details</h4>
              <button 
                onClick={() => setEditingProduct(null)}
                className="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditProduct} className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={e => setEditingProduct(prev => ({ ...prev, sku: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit type *</label>
                  <select
                    value={editingProduct.unit}
                    onChange={e => setEditingProduct(prev => ({ ...prev, unit: e.target.value }))}
                    className="form-select"
                  >
                    <option value="kg">kg</option>
                    <option value="pack">pack</option>
                    <option value="g">g</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    value={editingProduct.status}
                    onChange={e => setEditingProduct(prev => ({ ...prev, status: e.target.value }))}
                    className="form-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image Template *</label>
                <select
                  value={editingProduct.imageName}
                  onChange={e => setEditingProduct(prev => ({ ...prev, imageName: e.target.value }))}
                  className="form-select"
                >
                  <option value="chicken_curry.jpg">Chicken Curry Template</option>
                  <option value="chicken_kebab.jpg">Chicken Kebab Template</option>
                  <option value="rawas_fillet.jpg">Rawas Fillet Template</option>
                  <option value="chicken_tikka.jpg">Chicken Tikka Template</option>
                  <option value="chicken_biryani.jpg">Chicken Biryani Template</option>
                  <option value="prawns_medium.jpg">Prawns Medium Template</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="form-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-submit-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
