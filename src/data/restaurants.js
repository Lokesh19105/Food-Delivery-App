export const CUISINES = [
  { id: 'all', name: 'All Dishes', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burgers', icon: '🍔' },
  { id: 'chinese', name: 'Chinese', icon: '🍜' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
];

export const COUPONS = [
  { code: 'YUMZY50', discount: 50, type: 'percentage', maxDiscount: 150, minOrder: 199, description: '50% OFF up to ₹150' },
  { code: 'SUPER30', discount: 30, type: 'percentage', maxDiscount: 75, minOrder: 149, description: '30% OFF up to ₹75' },
  { code: 'FLAT100', discount: 100, type: 'flat', minOrder: 399, description: 'Flat ₹100 OFF on orders above ₹399' },
  { code: 'FREEFEE', discount: 40, type: 'flat', minOrder: 199, description: 'Free delivery coupon (₹40 OFF)' }
];

export const RESTAURANTS = [
  {
    id: 1,
    name: 'The Biryani Pavilion',
    rating: 4.5,
    reviewsCount: '1.2k+',
    deliveryTime: '25-30 mins',
    distance: '3.2 km',
    costForTwo: 350,
    cuisines: ['Biryani', 'Mughlai', 'North Indian'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60',
    featured: true,
    offer: '50% OFF up to ₹150',
    vegOnly: false,
    menu: [
      {
        id: 'bp1',
        name: 'Hyderabadi Chicken Biryani',
        price: 279,
        category: 'Biryani',
        rating: 4.7,
        isVeg: false,
        description: 'Authentic Hyderabadi biryani cooked with succulent chicken pieces and long-grain basmati rice with custom spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bp2',
        name: 'Paneer Makhani Biryani',
        price: 249,
        category: 'Biryani',
        rating: 4.4,
        isVeg: true,
        description: 'Fresh cottage cheese cubes cooked in rich makhani gravy layered with aromatic saffron rice.',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bp3',
        name: 'Chicken Tikka Starter',
        price: 219,
        category: 'Starters',
        rating: 4.6,
        isVeg: false,
        description: 'Spicy and smoky boneless chicken chunks marinated in yogurt and clay-oven roasted to perfection.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bp4',
        name: 'Veg Seekh Kabab',
        price: 189,
        category: 'Starters',
        rating: 4.2,
        isVeg: true,
        description: 'Delicious minced vegetables blended with fresh herbs and spices, skewered and roasted.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bp5',
        name: 'Shahi Tukda',
        price: 99,
        category: 'Desserts',
        rating: 4.8,
        isVeg: true,
        description: 'Royal Indian bread pudding soaked in saffron-infused milk syrup, layered with dense rabri and dry fruits.',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 2,
    name: 'Pizzeria Bella',
    rating: 4.3,
    reviewsCount: '800+',
    deliveryTime: '20-25 mins',
    distance: '1.8 km',
    costForTwo: 450,
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60',
    featured: true,
    offer: 'Free Garlic Bread on orders above ₹299',
    vegOnly: false,
    menu: [
      {
        id: 'pb1',
        name: 'Classic Margherita Pizza',
        price: 229,
        category: 'Pizza',
        rating: 4.6,
        isVeg: true,
        description: 'Classic mozzarella cheese, fresh basil leaves, and house-made rich san marzano tomato sauce on fresh hand-tossed dough.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'pb2',
        name: 'Fiery Pepperoni & Mushroom Pizza',
        price: 349,
        category: 'Pizza',
        rating: 4.8,
        isVeg: false,
        description: 'Spicy Italian pepperoni slices with fresh button mushrooms, loaded with extra mozzarella.',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'pb3',
        name: 'Creamy Alfredo Pasta',
        price: 269,
        category: 'Pasta',
        rating: 4.3,
        isVeg: true,
        description: 'Penne pasta tossed in rich white parmesan cream sauce along with sweet corn, broccoli, and peppers.',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'pb4',
        name: 'Cheesy Garlic Breadsticks',
        price: 139,
        category: 'Starters',
        rating: 4.5,
        isVeg: true,
        description: 'Freshly baked garlic butter crust layered with melted mozzarella and seasoned with mixed Italian herbs.',
        image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'pb5',
        name: 'Chocolate Lava Melt Cake',
        price: 119,
        category: 'Desserts',
        rating: 4.9,
        isVeg: true,
        description: 'Fudge cake with a gooey warm chocolate center that leaks out on first scoop.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 3,
    name: 'Burger & Co. Craft House',
    rating: 4.2,
    reviewsCount: '500+',
    deliveryTime: '15-20 mins',
    distance: '2.5 km',
    costForTwo: 300,
    cuisines: ['Burgers', 'Fast Food', 'Snacks'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
    featured: false,
    offer: '₹100 OFF on orders above ₹399',
    vegOnly: false,
    menu: [
      {
        id: 'bc1',
        name: 'Ultimate Cheeseburger Smash',
        price: 189,
        category: 'Burgers',
        rating: 4.7,
        isVeg: false,
        description: 'Double grilled flame patty, melted cheddar, house secret dressing, caramelised onions, and fresh pickles in a brioche bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bc2',
        name: 'Crunchy Veg Supreme Burger',
        price: 149,
        category: 'Burgers',
        rating: 4.4,
        isVeg: true,
        description: 'Crispy mixed-vegetable patty coated in golden breadcrumbs, stacked with lettuce, tomato, and creamy garlic herb mayo.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bc3',
        name: 'Salted Peri-Peri Fries',
        price: 99,
        category: 'Snacks',
        rating: 4.3,
        isVeg: true,
        description: 'Golden fried skin-on potato strips tossed in zesty, spicy peri-peri spice mix.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'bc4',
        name: 'Crispy Onion Rings',
        price: 119,
        category: 'Snacks',
        rating: 4.1,
        isVeg: true,
        description: 'Sweet white onion slices coated in light panko batter and deep fried until super crunchy.',
        image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 4,
    name: 'Wok Wonders',
    rating: 4.4,
    reviewsCount: '900+',
    deliveryTime: '30-35 mins',
    distance: '4.5 km',
    costForTwo: 400,
    cuisines: ['Chinese', 'Noodles', 'Asian'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=60',
    featured: false,
    offer: '30% OFF up to ₹75',
    vegOnly: false,
    menu: [
      {
        id: 'ww1',
        name: 'Szechuan Chilli Noodles',
        price: 199,
        category: 'Noodles',
        rating: 4.5,
        isVeg: true,
        description: 'Stir-fried noodles with crisp veggies and hot Szechuan peppercorn chilli oil sauce.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'ww2',
        name: 'Manchurian Gravy with Fried Rice',
        price: 249,
        category: 'Mains',
        rating: 4.6,
        isVeg: true,
        description: 'Golden fried vegetable nuggets dipped in hot, tangy ginger-garlic dark soy sauce gravy, served with wok-fried rice.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'ww3',
        name: 'Pan-fried Chicken Dimsums (6 pcs)',
        price: 219,
        category: 'Starters',
        rating: 4.8,
        isVeg: false,
        description: 'Delicate wheat wrappers filled with seasoned minced chicken, pan-seared to achieve a crispy bottom. Served with spicy dipping sauce.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'ww4',
        name: 'Crispy Honey Chilli Potatoes',
        price: 169,
        category: 'Starters',
        rating: 4.3,
        isVeg: true,
        description: 'Fried potato fingers coated in sesame-chilli paste and glazed with sweet organic honey.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 5,
    name: 'Green & Lean Organics',
    rating: 4.6,
    reviewsCount: '400+',
    deliveryTime: '20-25 mins',
    distance: '2.1 km',
    costForTwo: 350,
    cuisines: ['Healthy', 'Salads', 'Juices'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=60',
    featured: false,
    offer: 'Free organic juice on orders above ₹349',
    vegOnly: true,
    menu: [
      {
        id: 'gl1',
        name: 'Avocado Quinoa Power Salad',
        price: 249,
        category: 'Salads',
        rating: 4.7,
        isVeg: true,
        description: 'Tri-color organic quinoa, fresh buttery Haas avocado, cherry tomatoes, cucumbers, mixed greens with olive-lemon dressing.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'gl2',
        name: 'Paneer Tofu Wellness Wrap',
        price: 189,
        category: 'Wraps',
        rating: 4.4,
        isVeg: true,
        description: 'High-protein tofu chunks and paneer cubes sauteed in low-fat olive oil, rolled in a whole-wheat multi-seed tortilla wrap.',
        image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'gl3',
        name: 'Fresh Detox Cold-pressed Juice',
        price: 129,
        category: 'Juices',
        rating: 4.5,
        isVeg: true,
        description: 'Hydrating cold-pressed extract of green apples, spinach, cucumber, celery, mint, and a dash of lemon juice.',
        image: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 6,
    name: 'Sweet Truth Bakery',
    rating: 4.7,
    reviewsCount: '2.1k+',
    deliveryTime: '15-20 mins',
    distance: '1.2 km',
    costForTwo: 250,
    cuisines: ['Desserts', 'Bakery', 'Ice Cream'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=60',
    featured: true,
    offer: 'Free Cookie with every cake slice',
    vegOnly: true,
    menu: [
      {
        id: 'st1',
        name: 'Red Velvet Gourmet Cupcake',
        price: 89,
        category: 'Cupcakes',
        rating: 4.8,
        isVeg: true,
        description: 'Light and cocoa-infused red velvet cake base topped with rich and smooth cream cheese frosting swirl.',
        image: 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'st2',
        name: 'Fudge Walnut Brownie',
        price: 119,
        category: 'Brownies',
        rating: 4.9,
        isVeg: true,
        description: 'Rich, dense, chewy chocolate brownie loaded with roasted California walnut chunks. Warm before eating.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'st3',
        name: 'Salted Caramel Cheesecake Slice',
        price: 189,
        category: 'Cakes',
        rating: 4.7,
        isVeg: true,
        description: 'Creamy New York style baked cheesecake layered with a heavy drip of house-cooked salted caramel sauce.',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=60'
      }
    ]
  }
];
