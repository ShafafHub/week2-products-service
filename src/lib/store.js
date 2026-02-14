// src/lib/store.js

// in-memory storage
const products = [
  { id: 1, name: "Phone", price: 499 },
  { id: 2, name: "Laptop", price: 899 },
  { id: 3, name: "Tablet", price: 299 }
];

// لیست همه محصولات
function listProducts() {
  return products;
}

// پیدا کردن محصول با id
function findById(id) {
  return products.find(p => p.id === id);
}

// اعتبارسنجی محصول برای POST
function validateProduct(data) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    return 'Invalid name';
  }
  if (data.price === undefined || typeof data.price !== 'number' || data.price < 0) {
    return 'Invalid price';
  }
  return null;
}

module.exports = { listProducts, findById, products, validateProduct };
