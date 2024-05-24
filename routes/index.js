const router = require("express").Router();
const authRoute= require('./authRoute')
const companyRoute= require('./companyRute')
const projectRoute= require('./projectRute')
const sellsRoute= require('./sellsRute')
const sellsReportRoute= require('./sellsReportRoute')
const invoiceRute= require('./invoiceRute')
const workWorderRoute= require('./workWorderRoute')
const paymentRoute= require('./paymentRoute')
const inventoryRoute= require('./inventoryRoute')

// auth
router.use('/api/v1/auth',authRoute)
router.use('/api/v1/company',companyRoute)
router.use('/api/v1/project',projectRoute)
router.use('/api/v1/sells',sellsRoute)
router.use('/api/v1/sells-report',sellsReportRoute)
router.use('/api/v1/invoice',invoiceRute)
router.use('/api/v1/work-order',workWorderRoute)
router.use('/api/v1/payment',paymentRoute)
router.use('/api/v1/inventory',inventoryRoute)


module.exports= router