# Restaurant Management Admin Web Page

A modern, responsive restaurant management system built with React, TypeScript, and Tailwind CSS.

## Features

### Layout
- **Left Navigation Bar**: Menu items (Ordering, Reservations, Delivery, Revenue, Settings) with Log Out at the bottom
- **Top Search Bar**: Search for dishes by name
- **Top Right Controls**: Table selection and order type buttons (Dine-in, Takeaway, Delivery)
- **Main Content Area**: Display dishes with categories and filters
- **Right Order Panel**: Real-time order details with payment options
- **Bottom Progress Bar**: Shows current table statuses

### Dish Management
- Category filtering (All, Breakfast, Soups, Pasta, Mains, Salads)
- Vegetarian/Non-vegetarian indicators
- Discount badges (20% off)
- Quantity management with +/- buttons
- Real-time search functionality

### Order Processing
- Real-time order calculation
- Subtotal, service fee (5%), and total amount display
- Multiple payment methods (Card, Cash, Coupon)
- Order placement functionality

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Project Structure

```
restaurant/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Customization

### Adding New Dishes

Edit the `dishes` array in `src/App.tsx`:

```typescript
const dishes: Dish[] = [
  {
    id: 19,
    name: 'Your Dish Name',
    price: 45,
    category: 'Mains',
    isVeg: true,
    discount: 20 // Optional
  },
  // ... more dishes
];
```

### Changing Colors

The selected state uses a light green-yellow background. Modify colors in `tailwind.config.js`:

```javascript
extend: {
  colors: {
    'lime-yellow': '#E8F5C8',
    'light-orange': '#FFF4E6',
  }
}
```

## License

This project is provided as-is for educational and commercial use.
