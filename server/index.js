import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Data paths
const dataDir = path.join(__dirname, 'data');
const productsPath = path.join(dataDir, 'products.json');
const usersPath = path.join(dataDir, 'users.json');

// Initialize data directory and files if they don't exist
async function initializeDataFiles() {
  try {
    // Create data directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Create products.json if it doesn't exist
    try {
      await fs.access(productsPath);
    } catch {
      // Initial products data
      const productsData = [
        {
          id: 1,
          name: 'Organic Avocados',
          category: 'Fruits',
          price: 3.99,
          unit: 'each',
          image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600',
          dietary: ['organic', 'vegan', 'gluten-free'],
          badge: 'Organic',
          isFeatured: true
        },
        {
          id: 2,
          name: 'Farm Fresh Eggs',
          category: 'Dairy',
          price: 5.99,
          unit: 'dozen',
          image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
          dietary: [],
          badge: 'Local',
          isFeatured: true
        },
        // Add more products as needed
      ];
      
      await fs.writeFile(productsPath, JSON.stringify(productsData, null, 2));
    }
    
    // Create users.json if it doesn't exist
    try {
      await fs.access(usersPath);
    } catch {
      // Initial empty users array
      await fs.writeFile(usersPath, JSON.stringify([], null, 2));
    }
    
    console.log('Data files initialized successfully');
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Helper function to read JSON data
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

// Helper function to write JSON data
async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
}

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJsonFile(productsPath);
    
    if (!products) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await readJsonFile(productsPath);
    
    if (!products) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    
    const featuredProducts = products.filter(product => product.isFeatured);
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error getting featured products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = await readJsonFile(productsPath);
    
    if (!products) {
      return res.status(500).json({ message: 'Error reading products data' });
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    // Get existing users
    const users = await readJsonFile(usersPath);
    
    if (!users) {
      return res.status(500).json({ message: 'Error reading users data' });
    }
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save updated users
    const success = await writeJsonFile(usersPath, users);
    
    if (!success) {
      return res.status(500).json({ message: 'Error saving user data' });
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: newUser.id,
        email: newUser.email
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
          }
        });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Get users
    const users = await readJsonFile(usersPath);
    
    if (!users) {
      return res.status(500).json({ message: 'Error reading users data' });
    }
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        });
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // In a real app, you would save this to a database or send an email
    // For now, we'll just return success
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize data files and start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Frontend available at http://localhost:${PORT}`);
  });
});