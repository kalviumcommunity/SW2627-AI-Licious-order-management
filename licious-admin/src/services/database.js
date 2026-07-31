import supabase from '../lib/supabase'

async function select(table, columns = '*') {
  if (!supabase) return []
  const { data, error } = await supabase.from(table).select(columns)
  return error ? [] : (data || [])
}

export const inventoryService = { list: () => select('inventory_items') }
export const offerService = { list: () => select('offers') }
export const orderService = { list: () => select('orders', '*, order_items(quantity, unit_price, product_name, image_url)') }
export const settingsService = { get: async () => (await select('app_settings')).at(0) || null }
