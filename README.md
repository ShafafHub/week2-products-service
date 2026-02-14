# week2-products-service
Week 2: Pure HTTP Products Service API


## Example Requests

### Health check
curl http://localhost:3000/health

### List products
curl http://localhost:3000/products

### Get product by ID
curl http://localhost:3000/products/1

### Create product
curl -X POST http://localhost:3000/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Keyboard","price":49}'

### Update product
curl -X PUT http://localhost:3000/products/4 \
     -H "Content-Type: application/json" \
     -d '{"name":"Mechanical Keyboard","price":59}'

### Delete product
curl -X DELETE http://localhost:3000/products/4
