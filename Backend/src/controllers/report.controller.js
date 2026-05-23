import * as reportService from '../services/report.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getMonthlyReport(req, res) {
  const report = await reportService.getMonthlyReport(req.query)
  return sendSuccess(res, { report })
}

export async function exportMonthlyReport(req, res) {
  const { buffer, filename } = await reportService.buildMonthlyReportExcel(req.query)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.send(Buffer.from(buffer))
}
