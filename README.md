# Fresh Marketplace

A full-stack e-commerce website for fresh produce with a pure HTML/CSS/JavaScript frontend and Node.js/Express backend.

## Features

- Responsive design that works on mobile, tablet, and desktop devices
- Dynamic product marketplace with search and filtering
- Interactive shopping cart with quantity management
- User authentication (login/register)
- Contact form with validation
- RESTful API endpoints for products, cart operations, and authentication

## Tech Stack

### Frontend
- HTML5
- CSS3 (with custom variables and modern features)
- JavaScript (vanilla, no frameworks)

### Backend
- Node.js
- Express.js
- JSON files for data storage
- JWT for authentication

## Project Structure

```
fresh-marketplace/
├── public/             # Frontend static files
│   ├── css/            # CSS stylesheets
│   ├── js/             # JavaScript files
│   ├── images/         # Images and icons
│   └── *.html          # HTML pages
├── server/             # Backend code
│   ├── data/           # JSON data files (created on startup)
│   └── index.js        # Express server setup
├── vercel.json         # Vercel deployment configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fresh-marketplace.git
   cd fresh-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get a single product by ID

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Contact
- `POST /api/contact` - Submit contact form

## Deployment

### Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Run the deployment command:
   ```
   vercel
   ```

3. Follow the prompts to complete deployment

The `vercel.json` file in the repository is already configured to handle both the static frontend and the Node.js backend.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images sourced from [Pexels](https://www.pexels.com/)
- Icons from [Lucide](https://lucide.dev/)