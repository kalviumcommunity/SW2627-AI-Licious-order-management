import supabase from '../lib/supabase'
import { publishChange } from '../lib/socket'

const ensureClient = () => {
  if (!supabase) throw new Error('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.')
  return supabase
}

const emit = (table, action, record) => publishChange({ table, action, record })
const formatDate = value => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''

const mockOrders = [
  {
    id: 'LICI100201',
    customerName: 'Aarav Sharma',
    phone: '9812345678',
    items: [
      { name: 'Chicken Curry Cut (1 kg)', quantity: 1, price: 450 },
      { name: 'Chicken Seekh Kebab (250 g)', quantity: 2, price: 300 }
    ],
    price: 750,
    status: 'Preparing',
    date: 'Today, 11:30 AM',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    address: 'Indiranagar, Bengaluru',
    deliveryInstructions: 'Ring the bell after 6 PM.',
    deliveryPartner: { name: 'Ramesh', phone: '+91 98765 43210', estTime: '20 mins', status: 'Assigned' },
    timeline: ['Placed', 'Preparing', 'Packed']
  },
  {
    id: 'LICI100202',
    customerName: 'Nisha Rao',
    phone: '9876543210',
    items: [
      { name: 'Rawas Fillet (500 g)', quantity: 1, price: 749 },
      { name: 'Prawns Medium (500 g)', quantity: 1, price: 250 }
    ],
    price: 999,
    status: 'Out for Delivery',
    date: 'Today, 10:45 AM',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    address: 'Koramangala, Bengaluru',
    deliveryInstructions: 'Leave at reception.',
    deliveryPartner: { name: 'Suresh', phone: '+91 91234 56789', estTime: '12 mins', status: 'On the way' },
    timeline: ['Placed', 'Preparing', 'Out for Delivery']
  },
  {
    id: 'LICI100203',
    customerName: 'Kunal Verma',
    phone: '9123456789',
    items: [
      { name: 'Chicken Biryani (1 kg)', quantity: 1, price: 370 }
    ],
    price: 370,
    status: 'Delivered',
    date: 'Yesterday, 8:15 PM',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    address: 'Sarjapur, Bengaluru',
    deliveryInstructions: 'No contact delivery.',
    deliveryPartner: { name: 'Amit', phone: '+91 93456 78901', estTime: 'Delivered', status: 'Delivered' },
    timeline: ['Placed', 'Preparing', 'Delivered']
  },
  {
    id: 'LICI100204',
    customerName: 'Priya Menon',
    phone: '9988776655',
    items: [
      { name: 'Chicken Tikka (500 g)', quantity: 2, price: 380 }
    ],
    price: 760,
    status: 'Cancelled',
    date: 'Yesterday, 6:30 PM',
    paymentMethod: 'UPI',
    paymentStatus: 'Refunded',
    address: 'Whitefield, Bengaluru',
    deliveryInstructions: 'Call before arrival.',
    deliveryPartner: { name: 'Neeraj', phone: '+91 94567 89012', estTime: 'Cancelled', status: 'Cancelled' },
    timeline: ['Placed', 'Cancelled']
  },
  {
    id: 'LICI100205',
    customerName: 'Meera Iyer',
    phone: '9034567890',
    items: [
      { name: 'Chicken Seekh Kebab (250 g)', quantity: 1, price: 600 },
      { name: 'Prawns Medium (500 g)', quantity: 1, price: 250 }
    ],
    price: 850,
    status: 'New',
    date: 'Today, 12:10 PM',
    paymentMethod: 'Card',
    paymentStatus: 'Pending',
    address: 'HSR Layout, Bengaluru',
    deliveryInstructions: 'Please leave at the gate.',
    deliveryPartner: { name: 'Vijay', phone: '+91 90000 00000', estTime: '25 mins', status: 'Pending' },
    timeline: ['Placed', 'New']
  },
  {
    id: 'LICI100206',
    customerName: 'Rohan Das',
    phone: '8765432109',
    items: [
      { name: 'Chicken Biryani (1 kg)', quantity: 1, price: 370 },
      { name: 'Rawas Fillet (500 g)', quantity: 1, price: 749 }
    ],
    price: 1119,
    status: 'Preparing',
    date: 'Today, 1:20 PM',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    address: 'Marathahalli, Bengaluru',
    deliveryInstructions: 'Call on arrival.',
    deliveryPartner: { name: 'Kiran', phone: '+91 90909 90909', estTime: '35 mins', status: 'Cooking' },
    timeline: ['Placed', 'Preparing', 'Packed']
  }
]

const mockOffers = [
  { id: 'offer-101', title: 'Weekend Feast', code: 'FEAST10', start_date: '2026-08-01', end_date: '2026-08-08', description: '10% off on chicken combos.', created_at: '2026-08-01T10:00:00.000Z' },
  { id: 'offer-102', title: 'Seafood Splash', code: 'SEAFOOD20', start_date: '2026-08-05', end_date: '2026-08-15', description: 'Flat ₹200 off seafood orders above ₹1000.', created_at: '2026-08-03T12:00:00.000Z' }
]

const getSupabaseClient = () => {
  try {
    return ensureClient()
  } catch {
    return null
  }
}

export const toOrderView = row => {
  if (!row) return null
  if (row.customerName) {
    return {
      ...row,
      items: (row.items || []).map(item => ({
        id: item.id || `${row.id}-${item.name}`,
        name: item.name,
        quantity: item.quantity || 1,
        price: Number(item.price || 0),
        image: item.image || null
      })),
      price: Number(row.price || 0),
      date: row.date || '',
      paymentMethod: row.paymentMethod || 'Card',
      paymentStatus: row.paymentStatus || 'Paid',
      address: row.address || '',
      deliveryInstructions: row.deliveryInstructions || '',
      deliveryPartner: row.deliveryPartner || null
    }
  }

  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.customer_phone,
    items: (row.order_items || []).map(item => ({
      id: item.id,
      name: item.product_name,
      quantity: item.quantity,
      price: Number(item.unit_price),
      image: item.image_url || null
    })),
    price: Number(row.total_amount),
    status: row.status,
    date: formatDate(row.created_at),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    address: row.delivery_address,
    deliveryInstructions: row.delivery_instructions,
    deliveryPartner: row.delivery_partner
  }
}

export const inventoryService = {
  list: async () => {
    const client = getSupabaseClient()
    if (!client) return []
    const { data, error } = await client.from('inventory_items').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  create: async item => {
    const client = getSupabaseClient()
    if (!client) return item
    const { data, error } = await client.from('inventory_items').insert(item).select().single()
    if (error) throw error
    emit('inventory_items', 'INSERT', data)
    return data
  },
  update: async (id, changes) => {
    const client = getSupabaseClient()
    if (!client) return { id, ...changes }
    const { data, error } = await client.from('inventory_items').update({ ...changes, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    emit('inventory_items', 'UPDATE', data)
    return data
  },
  remove: async id => {
    const client = getSupabaseClient()
    if (!client) return id
    const { error } = await client.from('inventory_items').delete().eq('id', id)
    if (error) throw error
    emit('inventory_items', 'DELETE', { id })
  }
}

export const offerService = {
  list: async () => {
    const client = getSupabaseClient()
    if (!client) return mockOffers.map(offer => ({ ...offer }))
    try {
      const { data, error } = await client.from('offers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch {
      return mockOffers.map(offer => ({ ...offer }))
    }
  },
  create: async offer => {
    const client = getSupabaseClient()
    if (!client) {
      const created = { id: `offer-${Date.now()}`, created_at: new Date().toISOString(), ...offer }
      mockOffers.unshift(created)
      return created
    }
    try {
      const { data, error } = await client.from('offers').insert(offer).select().single()
      if (error) throw error
      emit('offers', 'INSERT', data)
      return data
    } catch {
      const created = { id: `offer-${Date.now()}`, created_at: new Date().toISOString(), ...offer }
      mockOffers.unshift(created)
      return created
    }
  }
}

export const orderService = {
  list: async () => {
    const client = getSupabaseClient()
    if (!client) return mockOrders.map(toOrderView)
    try {
      const { data, error } = await client.from('orders').select('*, order_items(id, quantity, unit_price, product_name, image_url)').order('created_at', { ascending: false })
      if (error) throw error

      const mappedOrders = (data || []).map(toOrderView)
      return mappedOrders.length > 0 ? mappedOrders : mockOrders.map(toOrderView)
    } catch {
      return mockOrders.map(toOrderView)
    }
  },
  updateStatus: async (id, status) => {
    const client = getSupabaseClient()
    if (!client) {
      const updated = mockOrders.find(order => order.id === id)
      if (!updated) throw new Error('Order not found')
      const order = toOrderView({ ...updated, status })
      emit('orders', 'UPDATE', order)
      return order
    }
    try {
      const { data, error } = await client.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('*, order_items(id, quantity, unit_price, product_name, image_url)').single()
      if (error) throw error
      const order = toOrderView(data)
      emit('orders', 'UPDATE', order)
      return order
    } catch {
      const updated = mockOrders.find(order => order.id === id)
      if (!updated) throw new Error('Order not found')
      const order = toOrderView({ ...updated, status })
      emit('orders', 'UPDATE', order)
      return order
    }
  }
}

export const settingsService = {
  get: async () => {
    const client = getSupabaseClient()
    if (!client) return null
    const { data, error } = await client.from('app_settings').select('*').eq('id', 1).single()
    if (error) throw error
    return data
  },
  save: async values => {
    const client = getSupabaseClient()
    if (!client) return { id: 1, data: values }
    const { data, error } = await client.from('app_settings').upsert({ id: 1, data: values, updated_at: new Date().toISOString() }).select().single()
    if (error) throw error
    emit('app_settings', 'UPDATE', data)
    return data
  }
}

export const adminUserService = {
  list: async () => {
    const client = getSupabaseClient()
    if (!client) return []
    const { data, error } = await client.from('admin_users').select('*').order('created_at')
    if (error) throw error
    return data || []
  },
  create: async user => {
    const client = getSupabaseClient()
    if (!client) return user
    const { data, error } = await client.from('admin_users').insert(user).select().single()
    if (error) throw error
    emit('admin_users', 'INSERT', data)
    return data
  },
  update: async (id, user) => {
    const client = getSupabaseClient()
    if (!client) return { id, ...user }
    const { data, error } = await client.from('admin_users').update({ ...user, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    emit('admin_users', 'UPDATE', data)
    return data
  },
  remove: async id => {
    const client = getSupabaseClient()
    if (!client) return id
    const { error } = await client.from('admin_users').delete().eq('id', id)
    if (error) throw error
    emit('admin_users', 'DELETE', { id })
  }
}
