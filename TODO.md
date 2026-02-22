# Vestra Wishlist & Bag Features Implementation

## TODO List:
- [x] 1. Create cart.js - Shared JavaScript for wishlist/bag functionality
- [x] 2. Update style.css - Add styles for product cards, buttons, counters
- [x] 3. Update index.html - Add wishlist/bag count badges in header
- [x] 4. Update wishlist.html - Display wishlisted products page
- [x] 5. Update bag.html - Display bag items with quantity controls
- [x] 6. Add sample products to men.html with Add to Wishlist/Bag buttons
- [x] 7. Add sample products to women.html with Add to Wishlist/Bag buttons
- [x] 8. Add sample products to kids.html with Add to Wishlist/Bag buttons
- [x] 9. Add sample products to footwear.html with Add to Wishlist/Bag buttons
- [x] 10. Add sample products to beauty.html with Add to Wishlist/Bag buttons
- [x] 11. Update profile.html with proper wishlist/bag navigation

## Implementation Details:
- Uses localStorage for data persistence
- Wishlist: Heart icon toggle, store product objects
- Bag: Add to cart, quantity +/- controls, remove item
- Badge counters on header icons
- Discount display on product cards
- Responsive product grid layout

## Features Implemented:
1. **Wishlist Feature:**
   - Add/remove products to wishlist with heart icon
   - View all wishlisted items on wishlist.html
   - Move items from wishlist to bag
   - Wishlist count badge in header

2. **Bag Feature:**
   - Add products to bag
   - Quantity controls (+/-)
   - Remove items from bag
   - Price summary with total
   - Bag count badge in header
   - Checkout button

3. **Product Display:**
   - Grid layout with product cards
   - Discount badges (random 10-50% off)
   - Original and discounted prices
   - Add to Bag and Wishlist buttons

4. **Data Persistence:**
   - All data saved in localStorage
   - Works without backend
