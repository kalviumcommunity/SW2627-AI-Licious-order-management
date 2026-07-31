import supabase from '../lib/supabase'

const client = () => {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  return supabase
}

const INVENTORY_TABLE_CANDIDATES = ['inventory_items', 'inventory', 'products']
const fail = (error) => { if (error) throw error }
const isMissingTableError = (error) => {
  const message = String(error?.message || '')
  return error?.code === '42P01' || /relation .* does not exist|could not find the table/.test(message)
}

let cachedInventoryTable = null

async function resolveInventoryTable() {
  if (cachedInventoryTable) return cachedInventoryTable

  let lastError = null
  for (const table of INVENTORY_TABLE_CANDIDATES) {
    const { error } = await client().from(table).select('id').limit(1)
    if (!error) {
      cachedInventoryTable = table
      return table
    }
    if (isMissingTableError(error)) {
      lastError = error
      continue
    }
    throw error
  }

  throw lastError || new Error('Could not find a usable inventory table in Supabase. Create the inventory_items table or point the app to the correct table name.')
}

export const inventoryService = {
  async list() {
    const table = await resolveInventoryTable()
    const { data, error } = await client().from(table).select('*').order('name')
    fail(error)
    return data
  },
  async create(values) {
    const table = await resolveInventoryTable()
    const { data, error } = await client().from(table).insert(values).select().single()
    fail(error)
    return data
  },
  async update(id, values) {
    const table = await resolveInventoryTable()
    const { data, error } = await client().from(table).update(values).eq('id', id).select().single()
    fail(error)
    return data
  },
  async remove(id) {
    const table = await resolveInventoryTable()
    const { error } = await client().from(table).delete().eq('id', id)
    fail(error)
  }
}

export const orderService = {
  async list() {
    const { data, error } = await client().from('orders').select('*, order_items(quantity, unit_price, product_name, image_url)').order('created_at', { ascending: false })
    fail(error)
    return data.map(normalizeOrder)
  },
  async get(id) { const { data, error } = await client().from('orders').select('*, order_items(quantity, unit_price, product_name, image_url)').eq('id', id).single(); fail(error); return normalizeOrder(data) },
  async create(values, items = []) {
    const { data: order, error } = await client().from('orders').insert(values).select().single(); fail(error)
    if (items.length) { const { error: itemsError } = await client().from('order_items').insert(items.map(item => ({ ...item, order_id: order.id }))); fail(itemsError) }
    return this.get(order.id)
  },
  async update(id, values) { const { data, error } = await client().from('orders').update(values).eq('id', id).select().single(); fail(error); return data },
  async updateStatus(id, status) { return this.update(id, { status }) },
  async remove(id) { const { error } = await client().from('orders').delete().eq('id', id); fail(error) }
}

export const offerService = {
  async list() { const { data, error } = await client().from('offers').select('*').order('created_at', { ascending: false }); fail(error); return data.map(normalizeOffer) },
  async get(id) { const { data, error } = await client().from('offers').select('*').eq('id', id).single(); fail(error); return normalizeOffer(data) },
  async create(values) { const { data, error } = await client().from('offers').insert(offerPayload(values)).select().single(); fail(error); return normalizeOffer(data) },
  async update(id, values) { const { data, error } = await client().from('offers').update(offerPayload(values)).eq('id', id).select().single(); fail(error); return normalizeOffer(data) },
  async remove(id) { const { error } = await client().from('offers').delete().eq('id', id); fail(error) }
}

const normalizeOffer = row => ({ ...row, discountValue: Number(row.discount_value), maxDiscount: Number(row.max_discount || 0), minOrderValue: Number(row.min_order_value || 0), startDate: row.start_date, endDate: row.end_date, usageLimit: row.usage_limit, usageCount: row.usage_count, applicableCategories: row.applicable_categories || [], applicableProducts: row.applicable_products || [], applyToAllProducts: row.apply_to_all_products, createdAt: row.created_at })
const offerPayload = values => ({ title: values.title, code: values.code || null, type: values.type, discount_value: Number(values.discountValue || 0), max_discount: values.maxDiscount === '' ? null : Number(values.maxDiscount || 0), min_order_value: Number(values.minOrderValue || 0), start_date: values.startDate, end_date: values.endDate, usage_limit: values.usageLimit === '' ? null : Number(values.usageLimit || 0), applicable_categories: values.applicableCategories || [], applicable_products: values.applicableProducts || [], apply_to_all_products: values.applyToAllProducts, disabled: Boolean(values.disabled) })

export const settingsService = {
  async get() { const { data, error } = await client().from('app_settings').select('*').eq('id', 1).single(); fail(error); return data },
  async save(values) { const { data, error } = await client().from('app_settings').upsert({ id: 1, ...values }, { onConflict: 'id' }).select().single(); fail(error); return data }
}

export const reportsService = {
  async get(from, to) {
    let query = client().from('orders').select('id, total_amount, status, created_at, order_items(quantity, unit_price, product_name, image_url)').gte('created_at', from.toISOString()).lte('created_at', to.toISOString())
    const { data, error } = await query
    fail(error)
    return buildReport(data, from, to)
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    price: Number(order.total_amount),
    customerName: order.customer_name,
    date: new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    phone: order.customer_phone,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    address: order.delivery_address,
    deliveryInstructions: order.delivery_instructions,
    deliveryPartner: order.delivery_partner,
    items: (order.order_items || []).map(item => ({ ...item, name: item.product_name, image: item.image_url, price: Number(item.unit_price) }))
  }
}

function buildReport(orders, from, to) {
  const delivered = orders.filter(order => order.status === 'Delivered')
  const totalRevenue = delivered.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const products = new Map()
  delivered.forEach(order => order.order_items.forEach(item => {
    const product = { name: item.product_name || 'Unknown product', category: 'Uncategorized', quantity: Number(item.quantity || 0) }
    const current = products.get(product.name) || { name: product.name, category: product.category, sold: 0, revenue: 0, stock: product.quantity }
    current.sold += item.quantity; current.revenue += Number(item.unit_price) * item.quantity; products.set(product.name, current)
  }))
  const categoryMap = new Map()
  products.forEach(product => categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + product.revenue))
  const days = Math.max(1, Math.ceil((to - from) / 86400000) + 1)
  const salesPoints = Array.from({ length: Math.min(days, 12) }, (_, index) => {
    const day = new Date(from); day.setDate(day.getDate() + index)
    const sales = delivered.filter(order => new Date(order.created_at).toDateString() === day.toDateString()).reduce((sum, order) => sum + Number(order.total_amount), 0)
    return { date: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), sales, cx: 40 + (420 * index / Math.max(1, Math.min(days, 12) - 1)), cy: 180 - (sales / Math.max(1, ...Array.from(products.values()).map(p => p.revenue), totalRevenue) * 150) }
  })
  return { totalRevenue, totalOrdersCount: orders.length, aov: orders.length ? Math.round(totalRevenue / orders.length) : 0, completionRate: orders.length ? Math.round(delivered.length / orders.length * 1000) / 10 : 0, salesPoints, categorySales: Array.from(categoryMap, ([name, sales], index) => ({ name, sales, percentage: totalRevenue ? Math.round(sales / totalRevenue * 100) : 0, color: ['#e32929', '#06b6d4', '#f59e0b', '#8b5cf6'][index % 4] })), topProducts: Array.from(products.values()).sort((a,b) => b.sold-a.sold).slice(0, 5).map((p, index) => ({ ...p, rank: index + 1, price: p.sold ? Math.round(p.revenue / p.sold) : 0, stock: p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock' })) }
}
