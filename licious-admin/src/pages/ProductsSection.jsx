import { useState } from 'react'
import chickenCurryImg from '../assets/chicken_curry.jpg'
import chickenKebabImg from '../assets/chicken_kebab.jpg'
import rawasFilletImg from '../assets/rawas_fillet.jpg'
import prawnsMediumImg from '../assets/prawns_medium.jpg'
import chickenTikkaImg from '../assets/chicken_tikka.jpg'
import chickenBiryaniImg from '../assets/chicken_biryani.jpg'
import { Plus, Search, Tag, Trash2 } from 'lucide-react'

const initialProducts = [
  {
    name: 'Chicken Curry Cut (1 kg)',
    category: 'Chicken',
    price: 450,
    stock: 'In Stock',
    quantity: 15,
    sku: 'CHC-001',
    status: 'Active',
    image: chickenCurryImg
  },
  {
    name: 'Chicken Seekh Kebab (250 g)',
    category: 'Kebabs',
    price: 600,
    stock: 'Low Stock',
    quantity: 4,
    sku: 'KB-002',
    status: 'Active',
    image: chickenKebabImg
  },
  {
    name: 'Rawas Fillet (500 g)',
    category: 'Fish & Seafood',
    price: 500,
    stock: 'In Stock',
    quantity: 25,
    sku: 'FS-003',
    status: 'Active',
    image: rawasFilletImg
  },
  {
    name: 'Prawns Medium (500 g)',
    category: 'Fish & Seafood',
    price: 250,
    stock: 'Out of Stock',
    quantity: 0,
    sku: 'FS-004',
    status: 'Pending',
    image: prawnsMediumImg
  },
  {
    name: 'Chicken Tikka (500 g)',
    category: 'Chicken',
    price: 450,
    stock: 'In Stock',
    quantity: 18,
    sku: 'TK-005',
    status: 'Active',
    image: chickenTikkaImg
  },
  {
    name: 'Chicken Biryani (1 kg)',
    category: 'Biryani',
    price: 370,
    stock: 'In Stock',
    quantity: 12,
    sku: 'BY-006',
    status: 'Active',
    image: chickenBiryaniImg
  }
]

function ProductsSection() {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Modal state for adding a new product
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Chicken',
    price: '',
    stock: 'In Stock',
    quantity: '',
    sku: '',
    status: 'Active',
    image: chickenCurryImg // Default placeholder image
  })

  // Extract unique categories
  const categories = ['All', ...new Set(initialProducts.map(p => p.category))]

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return

    const priceNum = parseFloat(newProduct.price)
    const qtyNum = parseInt(newProduct.quantity) || 0
    let stockStatus = 'In Stock'
    if (qtyNum === 0) stockStatus = 'Out of Stock'
    else if (qtyNum < 5) stockStatus = 'Low Stock'

    const addedProduct = {
      ...newProduct,
      price: priceNum,
      quantity: qtyNum,
      stock: stockStatus,
      sku: newProduct.sku || `PROD-${Date.now().toString().slice(-4)}`
    }

    setProducts([addedProduct, ...products])
    setIsModalOpen(false)
    setNewProduct({
      name: '',
      category: 'Chicken',
      price: '',
      stock: 'In Stock',
      quantity: '',
      sku: '',
      status: 'Active',
      image: chickenCurryImg
    })
  }

  const handleDeleteProduct = (sku) => {
    setProducts(products.filter(p => p.sku !== sku))
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Add, search, filter, and manage your inventory products.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#e32929] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#c41f1f] hover:shadow-md cursor-pointer justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-gray-100 pt-5">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f3f7fb] border-0 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
            />
          </div>

          {/* Categories list */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#e32929] text-white shadow-sm'
                    : 'bg-[#f3f7fb] text-gray-500 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-[#e32929] rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto font-medium">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div 
              key={product.sku} 
              className="group rounded-2xl border border-gray-150 bg-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-gray-250"
            >
              {/* Product Image & Badges */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                    product.status === 'Active' 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-extrabold text-white">
                  {product.sku}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug min-h-[40px]">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {/* Price and Stock info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">Price</span>
                    <span className="font-black text-base text-gray-800">₹{product.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">Stock Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        product.stock === 'In Stock' 
                          ? 'bg-green-500 animate-pulse' 
                          : product.stock === 'Low Stock' 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                      }`} />
                      <span className={`text-[11px] font-bold ${
                        product.stock === 'In Stock' 
                          ? 'text-green-600' 
                          : product.stock === 'Low Stock' 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stock} ({product.quantity || 0} left)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handleDeleteProduct(product.sku)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="bg-gradient-to-br from-[#e32929] to-[#c41f1f] p-5 text-white">
              <h3 className="text-lg font-bold">Add New Product</h3>
              <p className="text-xs text-white/80 mt-1 font-medium">Create a new product listing in the system</p>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicken Tikka (500 g)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  >
                    <option value="Chicken">Chicken</option>
                    <option value="Kebabs">Kebabs</option>
                    <option value="Fish & Seafood">Fish & Seafood</option>
                    <option value="Biryani">Biryani</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. TK-005"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 450"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Display Image</label>
                  <select
                    value={newProduct.image === chickenCurryImg ? 'chicken_curry' : newProduct.image === chickenKebabImg ? 'chicken_kebab' : newProduct.image === rawasFilletImg ? 'rawas_fillet' : newProduct.image === prawnsMediumImg ? 'prawns_medium' : newProduct.image === chickenTikkaImg ? 'chicken_tikka' : 'chicken_biryani'}
                    onChange={(e) => {
                      const mapping = {
                        chicken_curry: chickenCurryImg,
                        chicken_kebab: chickenKebabImg,
                        rawas_fillet: rawasFilletImg,
                        prawns_medium: prawnsMediumImg,
                        chicken_tikka: chickenTikkaImg,
                        chicken_biryani: chickenBiryaniImg
                      }
                      setNewProduct({...newProduct, image: mapping[e.target.value]})
                    }}
                    className="w-full bg-[#f3f7fb] border border-gray-150 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#e32929]/20"
                  >
                    <option value="chicken_curry">Chicken Curry</option>
                    <option value="chicken_kebab">Chicken Kebab</option>
                    <option value="rawas_fillet">Rawas Fillet</option>
                    <option value="prawns_medium">Prawns Medium</option>
                    <option value="chicken_tikka">Chicken Tikka</option>
                    <option value="chicken_biryani">Chicken Biryani</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#e32929] hover:bg-[#c41f1f] text-white shadow-md transition-all cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsSection
