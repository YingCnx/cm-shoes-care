const createCustomer = `
  INSERT INTO customers (name, phone, location) 
  VALUES ($1, $2, $3) RETURNING *;
`;
