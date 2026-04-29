function asyncHandler (fn) {
  return async function wrappedAsyncHandler (req, res, next) {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { asyncHandler }
