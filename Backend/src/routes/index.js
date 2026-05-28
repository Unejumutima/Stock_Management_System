import { Router } from 'express'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import inventoryRoutes from './inventory.routes.js'
import purchaseRoutes from './purchase.routes.js'
import saleRoutes from './sale.routes.js'
import expenseRoutes from './expense.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import reportRoutes from './report.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/purchases', purchaseRoutes)
router.use('/sales', saleRoutes)
router.use('/expenses', expenseRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/reports', reportRoutes)
router.use('/users', userRoutes)

export default router
