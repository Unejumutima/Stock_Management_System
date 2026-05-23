import * as productService from '../services/product.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'

export async function getProducts(req, res) {
  const products = await productService.listProducts(req.query)
  return sendSuccess(res, { products })
}

export async function getProduct(req, res) {
  const product = await productService.getProduct(req.params.id)
  return sendSuccess(res, { product })
}

export async function createProduct(req, res) {
  const product = await productService.createProduct(req.body)
  return sendCreated(res, { product })
}

export async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.params.id, req.body)
  return sendSuccess(res, { product })
}

export async function deleteProduct(req, res) {
  await productService.deleteProduct(req.params.id)
  return sendMessage(res, 'Product deleted successfully')
}
