import * as inventoryModel from '../models/inventory.model.js'
import { mapProduct } from '../utils/transform.js'

function mapInventoryRow(row) {
  const item = mapProduct(row)
  item.status = row.status
  item.inventoryValue = Number(row.inventory_value)
  return item
}

export async function listInventory(query) {
  const rows = await inventoryModel.findInventoryList({
    search: query.search,
    category: query.category,
    lowStockThreshold: query.lowStockThreshold ? Number(query.lowStockThreshold) : 75,
  })
  return rows.map(mapInventoryRow)
}

export async function getLowStock(query) {
  const threshold = query.threshold ? Number(query.threshold) : 75
  const rows = await inventoryModel.findLowStock(threshold)
  return rows.map(mapInventoryRow)
}

export async function getInventoryOverview() {
  const totals = await inventoryModel.getInventoryTotals()
  return {
    productCount: Number(totals.product_count),
    totalUnits: Number(totals.total_units),
    totalInventoryValue: Number(totals.total_inventory_value),
    outOfStockCount: Number(totals.out_of_stock_count),
    lowStockCount: Number(totals.low_stock_count),
  }
}

import ExcelJS from 'exceljs'

/**
 * Builds an Excel workbook of the full inventory snapshot.
 * Columns: Product, SKU, Category, Purchase Price, Selling Price,
 *          Qty Purchased, Qty Sold, Current Stock, Inventory Value, Status
 */
export async function buildInventoryExcel() {
  const rows = await inventoryModel.findInventoryList({})

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Zuba House Stock Management'
  wb.created = new Date()

  const ws = wb.addWorksheet('Inventory')
  ws.columns = [
    { header: 'Product',         key: 'name',            width: 32 },
    { header: 'SKU',             key: 'sku',             width: 14 },
    { header: 'Category',        key: 'category',        width: 16 },
    { header: 'Purchase Price',  key: 'purchase_price',  width: 16 },
    { header: 'Selling Price',   key: 'selling_price',   width: 16 },
    { header: 'Qty Purchased',   key: 'total_purchased', width: 14 },
    { header: 'Qty Sold',        key: 'total_sold',      width: 12 },
    { header: 'Current Stock',   key: 'stock',           width: 14 },
    { header: 'Inventory Value', key: 'inventory_value', width: 16 },
    { header: 'Status',          key: 'status',          width: 14 },
  ]

  // Style header row
  const headerRow = ws.getRow(1)
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B2735' } }
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })
  headerRow.height = 22

  const STATUS_LABEL = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' }
  const STATUS_COLOR = { in_stock: 'FF10B981', low_stock: 'FFF59E0B', out_of_stock: 'FFEF4444' }

  rows.forEach((r, i) => {
    const stock = Number(r.stock)
    const row = ws.addRow({
      name: r.name,
      sku: r.sku,
      category: r.category,
      purchase_price: `$${Number(r.purchase_price).toFixed(2)}`,
      selling_price: `$${Number(r.selling_price).toFixed(2)}`,
      total_purchased: Number(r.total_purchased),
      total_sold: Number(r.total_sold),
      stock,
      inventory_value: `$${Number(r.inventory_value).toFixed(2)}`,
      status: STATUS_LABEL[r.status] ?? r.status,
    })

    const bg = i % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF'
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
      cell.font = { size: 10 }
      cell.alignment = { vertical: 'middle' }
    })

    // Colour the Status cell
    const statusCell = row.getCell('status')
    statusCell.font = { bold: true, size: 10, color: { argb: STATUS_COLOR[r.status] ?? 'FF000000' } }
    row.height = 18
  })

  const buffer = await wb.xlsx.writeBuffer()
  const date = new Date().toISOString().split('T')[0]
  return { buffer, filename: `ZubaHouse_Inventory_${date}.xlsx` }
}
