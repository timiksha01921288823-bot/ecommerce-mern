const axios = require('axios');

const API_BASE_URL = 'http://localhost:5454';

// Sample products for testing
const products = [
  {
    "imageUrl": "https://rukminim1.flixcart.com/image/612/612/l5h2xe80/kurta/x/6/n/xl-kast-tile-green-majestic-man-original-imagg4z33hu4kzpv.jpeg?q=70",
    "brand": "Majestic Man",
    "title": "Men Printed Pure Cotton Straight Kurta",
    "color": "Green",
    "discountedPrice": 499,
    "price": 1499,
    "discountPersent": 66,
    "size": [
      {
        "name": "S",
        "quantity": 20
      },
      {
        "name": "M",
        "quantity": 30
      },
      {
        "name": "L",
        "quantity": 50
      }
    ],
    "quantity": 100,
    "topLavelCategory": "Men",
    "secondLavelCategory": "Clothing",
    "thirdLavelCategory": "mens_kurta",
    "description": "A traditional garment embodying elegance and grace. Crafted from fine fabrics, it features intricate embroidery and a relaxed fit, providing comfort and style."
  },
  {
    "imageUrl": "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/h/y/g/34-jeans-bt008-laheja-original-imagqqbsfgmdhcvn.jpeg?q=70",
    "brand": "LAHEJA",
    "title": "Men Regular Mid Rise Black Jeans",
    "color": "black",
    "discountedPrice": 599,
    "price": 1999,
    "discountPersent": 70,
    "size": [
      {
        "name": "S",
        "quantity": 20
      },
      {
        "name": "M",
        "quantity": 30
      },
      {
        "name": "L",
        "quantity": 50
      }
    ],
    "quantity": 100,
    "topLavelCategory": "Men",
    "secondLavelCategory": "Clothing",
    "thirdLavelCategory": "men_jeans",
    "description": "A traditional garment embodying elegance and grace. Crafted from fine fabrics, it features intricate embroidery and a relaxed fit, providing comfort and style."
  }
];

async function seedProducts() {
  try {
    let token;

    // Try to sign in first
    try {
      const signinResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: 'admin@gmail.com',
        password: '12345678'
      });

      if (signinResponse.status === 200) {
        token = signinResponse.data.jwt;
        console.log('Signed in successfully, token:', token);
      } else {
        console.log('Signin failed, trying to register user...');
        // Try to register the user
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@gmail.com',
          password: '12345678',
          role: 'ADMIN'
        });

        if (registerResponse.status === 200) {
          token = registerResponse.data.jwt;
          console.log('Registered and got token:', token);
        } else {
          throw new Error(`Registration failed: ${registerResponse.statusText}`);
        }
      }
    } catch (error) {
      console.log('Auth error:', error.message);
      throw error;
    }

    // Create products
    const response = await axios.post(`${API_BASE_URL}/api/admin/products/creates`, products, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('Products created successfully:', response.data);
    } else {
      throw new Error(`Product creation failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
}

seedProducts();