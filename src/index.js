const http = require('http');
const { listProducts, findById, products, validateProduct } = require('./lib/store');

const server = http.createServer((req, res) => {
  // =======================
  // GET /health
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // GET /products
  if (req.method === 'GET' && req.url === '/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listProducts()));
    return;
  }

  // GET /products/:id
  if (req.method === 'GET' && req.url.startsWith('/products/')) {
    const parts = req.url.split('/');
    const id = parseInt(parts[2]);
    const product = findById(id);
    if (product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found' }));
    }
    return;
  }

  // POST /products
  if (req.method === 'POST' && req.url === '/products') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const error = validateProduct(data);
        if (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error }));
          return;
        }
        const newProduct = {
          id: products.length ? products[products.length - 1].id + 1 : 1,
          name: data.name.trim(),
          price: data.price
        };
        products.push(newProduct);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newProduct));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // =======================
  // PUT /products/:id
  if (req.method === 'PUT' && req.url.startsWith('/products/')) {
    const parts = req.url.split('/');
    const id = parseInt(parts[2]);
    const product = findById(id);

    if (!product) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.name !== undefined) {
          if (typeof data.name !== 'string' || data.name.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid name' }));
            return;
          }
          product.name = data.name.trim();
        }
        if (data.price !== undefined) {
          if (typeof data.price !== 'number' || data.price < 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid price' }));
            return;
          }
          product.price = data.price;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(product));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // =======================
  // DELETE /products/:id
  if (req.method === 'DELETE' && req.url.startsWith('/products/')) {
    const parts = req.url.split('/');
    const id = parseInt(parts[2]);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found' }));
      return;
    }

    products.splice(index, 1);
    res.writeHead(204);
    res.end();
    return;
  }

  // مسیر نامشخص → 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// =======================
server.listen(3000, () => console.log('Server running on port 3000'));
