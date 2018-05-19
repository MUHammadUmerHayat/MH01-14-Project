const lib = require('./lib');
const external = require('./external');

describe('"absolute()" function:', () => {
  it('should return pos. number if input is pos.', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });
  it('should return pos. number if input is neg.', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });
  it('should return 0 if input is 0', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe('"greet()" function:', () => {
  it('should return "Hello <name>!!!"', () => {
    const result = lib.greet('Abbie');
    expect(result).toBe('Hello Abbie!!!');
    expect(result).toMatch(/Abbie/);
    expect(result).toContain('Abbie');
  });
});

describe('"getArray" function:', () => {
  it("should return array ['A','B','C']", () => {
    const result = lib.getArray();
    // Too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    // Too specific
    expect(result[0]).toBe('A');
    expect(result[1]).toBe('B');
    expect(result[2]).toBe('C');
    expect(result.length).toBe(3);
    // Proper way
    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result).toContain('C');
    // Ideal way
    expect(result).toEqual(expect.arrayContaining(['C', 'A', 'B']));
  });
});

describe('"getObject" function:', () => {
  it('should return object with given id and name', () => {
    const result = lib.getObject(1, 'Object Name');
    // This test will fail
    // expect(result).toBe({id: 1, name: 'Object Name'});

    // To match only selected properties, will pass for {id, name, ...}
    // expect(result).toMatchObject({id: 1, name: 'Object Name'});

    expect(result).toHaveProperty('id', 1);
    expect(result).toEqual({id: 1, name: 'Object Name'});
  });
});

describe('"getError" function:', () => {
  it('should throw error if no argument is provided', () => {
    // Should use parameterized tests to test [null, undefined, NaN, '', 0, false]
    // This does not follow 'single assertion principle'
    const args = [null, undefined, NaN, '', 0, false];
    args.forEach(arg => {
      expect(() => lib.getError(arg)).toThrow();
    });
  });

  it('should return object if argument is passed', () => {
    const result = lib.getError('Data');
    expect(result).toHaveProperty('data', 'Data');
    expect(result.date).toBeGreaterThan(0);
  });
});

describe('"fizzBuzz" function: ', () => {
  it('should throw an expection if input is not a number', () => {
    expect(() => lib.fizzBuzz('X')).toThrow();
    expect(() => lib.fizzBuzz(null)).toThrow();
    expect(() => lib.fizzBuzz(undefined)).toThrow();
    expect(() => lib.fizzBuzz({})).toThrow();
  });
  it("should return 'FizzBuzz' if input is divisible by 3 and 5", () => {
    const result = lib.fizzBuzz(15);
    expect(result).toBe('FizzBuzz');
  });
  it("should return 'Fizz' if input is only divisible by 3", () => {
    const result = lib.fizzBuzz(3);
    expect(result).toBe('Fizz');
  });
  it("should return 'Buzz' if input is only divisible by 5", () => {
    const result = lib.fizzBuzz(5);
    expect(result).toBe('Buzz');
  });
  it("should return input if input is not divisible by 3 or 5", () => {
    const result = lib.fizzBuzz(1);
    expect(result).toBe(1);
  });
});

describe('"applyDiscount" function: ', () => {
  it('should apply 10% discount if customer has more than 10 points', () => {
    // Mock function
    external.getCustomerSync = (customerId) => {
      console.log('Fake reading from database...');
      return {id: customerId, points: 20};
    };

    const order = {customerId: 1, total: 10};
    lib.applyDiscount(order);
    expect(order.total).toBe(9);
  });
});

describe('"notifyCustomer" function: ', () => {
  it('should send email to customer', () => {
    // Mock functions
    external.getCustomerSync = (customerId) => {
      console.log('Fake reading from database...');
      return {email: 'a'};
    };
    let mailSent = false;
    external.sendMail = (email, message) => {
      console.log('Fake sending email...');
      mailSent = true;
    };
    lib.notifyCustomer({customerId: 1});
    expect(mailSent).toBe(true);
  });
});

describe('"notifyCustomer" function using Jest mock functions: ', () => {
  it('should send email to customer', () => {
    external.getCustomerSync = jest.fn().mockReturnValue({email: 'a'});
    external.sendMail = jest.fn();

    lib.notifyCustomer({customerId: 1});
    expect(external.sendMail).toHaveBeenCalled();
    expect(external.sendMail.mock.calls[0][0]).toBe('a');
    expect(external.sendMail.mock.calls[0][1]).toMatch(/successfully/);
  });
});
