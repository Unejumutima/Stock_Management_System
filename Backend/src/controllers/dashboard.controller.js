import * as dashboardService from '../services/dashboard.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getDashboard(req, res) {
  const data = await dashboardService.getDashboard(req.query)
  return sendSuccess(res, data)
}
