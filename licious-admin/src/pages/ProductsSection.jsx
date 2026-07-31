const products = [
  {
    name: 'Chicken Curry Cut',
    category: 'Chicken',
    price: 450,
    stock: 'In Stock',
    sku: 'CHC-001',
    status: 'Active'
  },
  {
    name: 'Chicken Seekh Kebab',
    category: 'Kebabs',
    price: 600,
    stock: 'Low Stock',
    sku: 'KB-002',
    status: 'Active'
  },
  {
    name: 'Rawas Fillet',
    category: 'Fish & Seafood',
    price: 500,
    stock: 'In Stock',
    sku: 'FS-003',
    status: 'Active'
  },
  {
    name: 'Prawns Medium',
    category: 'Fish & Seafood',
    price: 250,
    stock: 'Out of Stock',
    sku: 'FS-004',
    status: 'Pending'
  }
]

function ProductsSection() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Products</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              A simple products overview for the admin dashboard.
            </p>
          </div>
          <button className="inline-flex items-center rounded-xl bg-[#e32929] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#c41f1f]">
            Add Product
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <div key={product.sku} className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                <p className="mt-1 text-xs font-semibold text-gray-400">{product.sku}</p>
              </div>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#e32929]">
                {product.status}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">{product.category}</span>
              <span className="font-extrabold text-gray-800">₹{product.price}</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-400">Stock</span>
              <span className={`rounded-full px-2.5 py-1 ${product.stock === 'In Stock' ? 'bg-green-50 text-green-600' : product.stock === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                {product.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsSection
