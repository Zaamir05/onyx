const { Router } = require('express')
const { asyncHandler } = require('../../../utils/async-handler')
const { requireAuth, requireRoles } = require('../../../middlewares/auth.middleware')
const { validate } = require('../../../middlewares/validate.middleware')
const { listUsersSchema } = require('../validators/list-users.schema')
const { updateUserSchema } = require('../validators/update-user.schema')
const { listAdminAuctionsSchema } = require('../validators/list-auctions.schema')
const {
  getAdminDashboardController,
  listUsersController,
  updateUserController,
  listAuctionsController,
  cancelAuctionController
} = require('../controllers/admin.controller')

const adminRouter = Router()

adminRouter.use(requireAuth, requireRoles('admin'))

adminRouter.get('/dashboard', asyncHandler(getAdminDashboardController))
adminRouter.get('/users', validate(listUsersSchema), asyncHandler(listUsersController))
adminRouter.patch('/users/:userId', validate(updateUserSchema), asyncHandler(updateUserController))
adminRouter.get('/auctions', validate(listAdminAuctionsSchema), asyncHandler(listAuctionsController))
adminRouter.patch('/auctions/:auctionId/cancel', asyncHandler(cancelAuctionController))

module.exports = { adminRouter }
