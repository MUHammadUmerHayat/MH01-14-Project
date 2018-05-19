module.exports = (routeHandlerFunction) => {
  return async (req, res, next) => {
    try {
      await routeHandlerFunction(req, res);
    } catch(err) {
      next(err);
    }    
  }
};
