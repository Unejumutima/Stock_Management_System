/**
 * Maps PostgreSQL snake_case rows to camelCase for the React frontend.
 */

export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function mapRow(row) {
  if (!row) return null
  const out = {}
  for (const [key, value] of Object.entries(row)) {
    out[toCamelCase(key)] = value
  }
  return out
}

export function mapRows(rows) {
  return rows.map(mapRow)
}

/** Format numeric DB strings to numbers for JSON */
export function mapProduct(row) {
  const p = mapRow(row)
  if (!p) return null
  if (p.purchasePrice != null) p.purchasePrice = Number(p.purchasePrice)
  if (p.sellingPrice != null) p.sellingPrice = Number(p.sellingPrice)
  if (p.stock != null) p.stock = Number(p.stock)
  if (p.totalPurchased != null) p.totalPurchased = Number(p.totalPurchased)
  if (p.totalSold != null) p.totalSold = Number(p.totalSold)
  return p
}

export function mapPurchase(row) {
  const r = mapRow(row)
  if (!r) return null
  if (r.quantity != null) r.quantity = Number(r.quantity)
  if (r.pricePerUnit != null) r.pricePerUnit = Number(r.pricePerUnit)
  if (r.totalCost != null) r.totalCost = Number(r.totalCost)
  return r
}

export function mapSale(row) {
  const r = mapRow(row)
  if (!r) return null
  if (r.quantity != null) r.quantity = Number(r.quantity)
  if (r.sellingPrice != null) r.sellingPrice = Number(r.sellingPrice)
  if (r.totalRevenue != null) r.totalRevenue = Number(r.totalRevenue)
  return r
}

export function mapExpense(row) {
  const r = mapRow(row)
  if (!r) return null
  if (r.amount != null) r.amount = Number(r.amount)
  // Frontend uses "description" for notes in some places; expose both
  if (r.notes != null) r.description = r.notes
  return r
}
