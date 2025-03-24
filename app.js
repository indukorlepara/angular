const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sample items to insert into MongoDB
const sampleItems = [
    { name: 'Item 1', description: 'Description of Item 1' },
    { name: 'Item 2', description: 'Description of Item 2' },
    { name: 'Item 3', description: 'Description of Item 3' },
  ];

mongoose.connect('mongodb+srv://indukin:cqTmerndIyqHw8rY@cluster0.dkb1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect(dbURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => {
//       console.log('Connected to MongoDB');
  
//       // Insert sample data
//       Item.insertMany(sampleItems)
//         .then((docs) => {
//           console.log('Sample items added:', docs);
//           mongoose.connection.close(); // Close connection after insertion
//         })
//         .catch((err) => {
//           console.error('Error inserting sample data:', err);
//           mongoose.connection.close(); // Close connection in case of error
//         });
//     })
//     .catch((err) => {
//       console.error('Error connecting to MongoDB:', err);
//     });
    

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   price: Number,
//   stock: Number
// });

// const Product = mongoose.model('Product', productSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

// Sample Data Creation Function
async function createSampleData() {
  const sampleProducts = [
    {
      name: 'Laptop',
      description: 'High-end gaming laptop',
      price: 1500,
      stock: 10
    },
    {
      name: 'Smartphone',
      description: 'Flagship smartphone',
      price: 999,
      stock: 20
    },
    {
      name: 'Tablet',
      description: 'Portable tablet',
      price: 499,
      stock: 15
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling headphones',
      price: 199,
      stock: 25
    },
    {
      name: 'Smartwatch',
      description: 'Fitness smartwatch',
      price: 129,
      stock: 30
    }
  ];

  // Check if products already exist to avoid duplicates
  const existingProducts = await Product.find();

  if (existingProducts.length === 0) {
    // If no products exist, create sample data
    await Product.create(sampleProducts);
    console.log('Sample products have been added to the database.');
  } else {
    console.log('Products already exist in the database.');
  }
}

// Call the function to create sample data
createSampleData();

// CRUD Routes
app.post('/api/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.get('/api/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
});

app.put('/api/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  res.json(item);
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product details
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
