const mongoose = require('mongoose')
const { User, USER_ROLES } = require('../../users/models/user.model')
const { Auction, AUCTION_STATUS } = require('../../auctions/models/auction.model')
const { Bid } = require('../../bids/models/bid.model')
const { HTTP_STATUS } = require('../../../constants/http-status')
const { AppError } = require('../../../utils/app-error')

function escapeRegex (value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sanitizeUser (user) {
  return {
    id: String(user._id),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    onyxCredits: user.onyxCredits,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    profile: user.profile,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

function sanitizeAuction (auction) {
  return {
    ...auction,
    id: String(auction._id),
    sellerId: auction.sellerId?._id ? String(auction.sellerId._id) : String(auction.sellerId),
    seller: auction.sellerId?._id
      ? {
          id: String(auction.sellerId._id),
          fullName: auction.sellerId.fullName,
          email: auction.sellerId.email
        }
      : null
  }
}

async function getAdminDashboardController (_req, res) {
  const [
    totalUsers,
    activeUsers,
    buyers,
    sellers,
    admins,
    totalAuctions,
    activeAuctions,
    draftAuctions,
    endedAuctions,
    settledAuctions,
    cancelledAuctions,
    totalBids,
    recentUsers,
    recentAuctions,
    recentBids
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: USER_ROLES.BUYER }),
    User.countDocuments({ role: USER_ROLES.SELLER }),
    User.countDocuments({ role: USER_ROLES.ADMIN }),
    Auction.countDocuments({}),
    Auction.countDocuments({ status: AUCTION_STATUS.ACTIVE }),
    Auction.countDocuments({ status: AUCTION_STATUS.DRAFT }),
    Auction.countDocuments({ status: AUCTION_STATUS.ENDED }),
    Auction.countDocuments({ status: AUCTION_STATUS.SETTLED }),
    Auction.countDocuments({ status: AUCTION_STATUS.CANCELLED }),
    Bid.countDocuments({}),
    User.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select('_id email fullName role onyxCredits isActive profile lastLoginAt createdAt updatedAt')
      .lean(),
    Auction.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('sellerId', 'fullName email')
      .lean(),
    Bid.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('auctionId', 'title currency currentBid')
      .populate('bidderId', 'fullName email role')
      .lean()
  ])

  return res.status(HTTP_STATUS.OK).json({
    data: {
      summary: {
        totalUsers,
        activeUsers,
        buyers,
        sellers,
        admins,
        totalAuctions,
        activeAuctions,
        draftAuctions,
        endedAuctions,
        settledAuctions,
        cancelledAuctions,
        totalBids
      },
      system: {
        databaseConnected: mongoose.connection.readyState === 1
      },
      recentUsers: recentUsers.map(sanitizeUser),
      recentAuctions: recentAuctions.map(sanitizeAuction),
      recentBids: recentBids.map((bid) => ({
        id: String(bid._id),
        auctionId: bid.auctionId?._id ? String(bid.auctionId._id) : String(bid.auctionId),
        auctionTitle: bid.auctionId?.title || 'Unknown auction',
        bidderId: bid.bidderId?._id ? String(bid.bidderId._id) : String(bid.bidderId),
        bidderName: bid.bidderId?.fullName || 'Unknown bidder',
        bidderRole: bid.bidderId?.role || null,
        bidAmount: bid.bidAmount,
        currency: bid.currency,
        createdAt: bid.createdAt
      }))
    }
  })
}

async function listUsersController (req, res) {
  const {
    page,
    limit,
    search,
    role,
    isActive,
    sortBy,
    sortOrder
  } = req.query

  const filter = {}
  if (role) filter.role = role
  if (typeof isActive === 'boolean') filter.isActive = isActive
  if (search) {
    const query = escapeRegex(search)
    filter.$or = [
      { email: { $regex: query, $options: 'i' } },
      { fullName: { $regex: query, $options: 'i' } }
    ]
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1
  const sort = { [sortBy]: sortDirection }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter)
  ])

  return res.status(HTTP_STATUS.OK).json({
    data: items.map(sanitizeUser),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}

async function updateUserController (req, res) {
  const { userId } = req.params
  const actorId = req.auth.userId
  const actorRole = req.auth.role
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
  }

  const { fullName, role, isActive, onyxCredits, profile } = req.body
  const isSelf = String(user._id) === String(actorId)
  const roleChangeRequested = role !== undefined && role !== user.role
  const activeChangeRequested = isActive !== undefined && isActive !== user.isActive
  const nextRole = role !== undefined ? role : user.role
  const nextIsActive = isActive !== undefined ? isActive : user.isActive
  const wouldRemoveLastAdmin = user.role === USER_ROLES.ADMIN && (nextRole !== USER_ROLES.ADMIN || nextIsActive === false)

  if (isSelf && (roleChangeRequested || activeChangeRequested)) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'You cannot change your own admin access from the admin panel')
  }

  if (actorRole !== USER_ROLES.ADMIN) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'Insufficient permissions')
  }

  if (wouldRemoveLastAdmin) {
    const remainingAdmins = await User.countDocuments({
      role: USER_ROLES.ADMIN,
      isActive: true,
      _id: { $ne: user._id }
    })
    if (remainingAdmins === 0) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'At least one active admin must remain')
    }
  }

  if (fullName !== undefined) user.fullName = fullName
  if (role !== undefined) user.role = role
  if (isActive !== undefined) user.isActive = isActive
  if (onyxCredits !== undefined) user.onyxCredits = onyxCredits
  if (profile) {
    if (Object.prototype.hasOwnProperty.call(profile, 'avatarUrl')) {
      user.profile.avatarUrl = profile.avatarUrl
    }
    if (Object.prototype.hasOwnProperty.call(profile, 'phone')) {
      user.profile.phone = profile.phone
    }
  }

  await user.save()

  return res.status(HTTP_STATUS.OK).json({
    message: 'User updated',
    data: { user: sanitizeUser(user) }
  })
}

async function listAuctionsController (req, res) {
  const {
    page,
    limit,
    search,
    status,
    sellerId,
    sortBy,
    sortOrder
  } = req.query

  const filter = {}
  if (status) filter.status = status
  if (sellerId) filter.sellerId = sellerId
  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: 'i' }
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1
  const sort = { [sortBy]: sortDirection }

  const [items, total] = await Promise.all([
    Auction.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sellerId', 'fullName email role')
      .lean(),
    Auction.countDocuments(filter)
  ])

  return res.status(HTTP_STATUS.OK).json({
    data: items.map(sanitizeAuction),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}

async function cancelAuctionController (req, res) {
  const { auctionId } = req.params
  const auction = await Auction.findById(auctionId)

  if (!auction) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Auction not found')
  }

  if (![AUCTION_STATUS.DRAFT, AUCTION_STATUS.ACTIVE].includes(auction.status)) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Auction cannot be cancelled in current state')
  }

  auction.status = AUCTION_STATUS.CANCELLED
  await auction.save()

  return res.status(HTTP_STATUS.OK).json({
    message: 'Auction cancelled',
    data: { auction }
  })
}

module.exports = {
  getAdminDashboardController,
  listUsersController,
  updateUserController,
  listAuctionsController,
  cancelAuctionController
}
