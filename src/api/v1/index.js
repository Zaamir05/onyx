const { Router } = require('express')
const { usersRouter } = require('../../modules/users/routes/users.route')
const { auctionsRouter } = require('../../modules/auctions/routes/auctions.route')
const { bidsRouter } = require('../../modules/bids/routes/bids.route')
const { adminRouter } = require('../../modules/admin/routes/admin.route')

const router = Router()

router.use('/users', usersRouter)
router.use('/auctions', auctionsRouter)
router.use('/bids', bidsRouter)
router.use('/admin', adminRouter)

module.exports = { v1Router: router }
