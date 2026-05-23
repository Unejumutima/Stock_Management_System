/**
 * Reusable SQL fragments for dynamic stock calculation.
 * Stock = SUM(purchases.quantity) - SUM(sales.quantity)
 */

export const STOCK_SUBQUERY = `
  COALESCE((
    SELECT SUM(pu.quantity) FROM purchases pu WHERE pu.product_id = p.id
  ), 0) - COALESCE((
    SELECT SUM(sa.quantity) FROM sales sa WHERE sa.product_id = p.id
  ), 0)
`

export const TOTAL_PURCHASED_SUBQUERY = `
  COALESCE((SELECT SUM(pu.quantity) FROM purchases pu WHERE pu.product_id = p.id), 0)
`

export const TOTAL_SOLD_SUBQUERY = `
  COALESCE((SELECT SUM(sa.quantity) FROM sales sa WHERE sa.product_id = p.id), 0)
`
