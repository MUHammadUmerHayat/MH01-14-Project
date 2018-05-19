const external = require('./external');

module.exports.absolute = (num) => {
  return num >= 0 ? num : -num;
};

module.exports.greet = (name) => {
  return `Hello ${name}!!!`;
};

module.exports.getArray = () => {
  return ['A', 'B', 'C'];
};

module.exports.getObject = (id, name) => {
  return {id, name};
}

module.exports.getError = (arg) => {
  if(!arg) throw new Error('No argument');
  return {date: new Date().getTime(), data: arg};
};

module.exports.fizzBuzz = (input) => {
  if(typeof input !== 'number') throw new Error('Input should be a number');
  if((input % 3 === 0) && (input % 5 === 0)) return 'FizzBuzz';
  if(input % 3 === 0) return 'Fizz';
  if(input % 5 === 0) return 'Buzz';
  return input;
};

module.exports.applyDiscount = (order) => {
  const customer = external.getCustomerSync(order.customerId);
  if(customer.points > 10) order.total *= 0.9;
};

module.exports.notifyCustomer = (order) => {
  const customer = external.getCustomerSync(order.customerId);
  external.sendMail(customer.email, 'Your order was placed successfully.');
}
