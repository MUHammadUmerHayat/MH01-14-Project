// Pretend this is real implementation that accesses database
module.exports.getCustomerSync = (id) => {
  console.log('Reading from database...');
  return {id, points: 11};
};
