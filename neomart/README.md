# NeoMart - Modern eCommerce Website

A complete, modern eCommerce website built with HTML5, CSS3, JavaScript ES6+, and Firebase backend integration. Features a clean, responsive design with a navy blue color scheme and comprehensive shopping functionality.

## 🌟 Features

### Core Functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Authentication**: Firebase Auth with email/password and Google OAuth
- **Product Catalog**: Dynamic product listing with search and filtering
- **Shopping Cart**: Local storage with Firebase cloud sync
- **User Profiles**: Account management and order history
- **Modern UI/UX**: Clean design with smooth animations

### Pages Included
1. **Homepage** (`index.html`) - Hero section, featured products, company features
2. **Products** (`products.html`) - Product catalog with filters and search
3. **Authentication** (`auth.html`) - Login/Register with social auth options
4. **About** (`about.html`) - Company information and team profiles
5. **Contact** (`contact.html`) - Contact form, info, and FAQ section

### Technical Features
- **Firebase Integration**: Authentication, Firestore database, Cloud Storage
- **Modern JavaScript**: ES6+ modules, async/await, destructuring
- **CSS Custom Properties**: Consistent theming and design system
- **Performance Optimized**: Lazy loading, debounced search, efficient animations
- **Accessibility**: ARIA labels, keyboard navigation, screen reader friendly
- **SEO Optimized**: Proper meta tags, semantic HTML structure

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)
- Firebase account (for backend functionality)

### Installation

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd neomart
   ```

2. **Set up Firebase** (Optional - works with mock data)
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Update `scripts/firebase-config.js` with your config

3. **Start a Local Server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in Browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
neomart/
├── index.html              # Homepage
├── auth.html               # Authentication page
├── products.html           # Product catalog
├── about.html             # About page
├── contact.html           # Contact page
├── styles/
│   ├── main.css          # Global styles and components
│   └── home.css          # Homepage-specific styles
├── scripts/
│   ├── firebase-config.js # Firebase setup and configuration
│   ├── utils.js          # Utility functions and helpers
│   ├── auth.js           # Authentication functionality
│   ├── cart.js           # Shopping cart management
│   ├── home.js           # Homepage functionality
│   └── products.js       # Product catalog functionality
└── README.md             # Project documentation
```

## 🔧 Configuration

### Firebase Setup (Optional)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication and Firestore

2. **Update Configuration**
   Edit `scripts/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
   };
   ```

3. **Set up Firestore Security Rules**
   Copy the rules from `firebase-config.js` comments to your Firestore rules

### Customization

- **Colors**: Modify CSS custom properties in `styles/main.css`
- **Logo**: Replace logo elements in navigation
- **Content**: Update text content in HTML files
- **Products**: Add real products in Firebase or modify mock data

## 🎨 Design System

### Color Palette
- **Primary**: Navy Blue (#3730a3)
- **Accent**: Light Navy (#6366f1)
- **Background**: Light Gray (#f9fafb)
- **Text**: Dark Gray (#374151)

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body**: Roboto (Google Fonts)

### Components
- Buttons with hover effects
- Cards with shadow and hover animations
- Form inputs with focus states
- Modals and toasts for notifications

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Mobile

## 🛠️ Development

### Adding New Products
```javascript
// In products.js or via Firebase
const newProduct = {
    id: 'unique-id',
    name: 'Product Name',
    price: 99.99,
    image: 'image-url',
    category: 'Category',
    description: 'Product description',
    inStock: true,
    featured: false
};
```

### Extending Functionality
- Add new pages by following existing structure
- Use utility functions from `utils.js`
- Follow established naming conventions
- Maintain responsive design patterns

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Errors**
   - Check console for authentication errors
   - Verify Firebase configuration
   - Ensure Firestore rules are set correctly

2. **Styling Issues**
   - Clear browser cache
   - Check for CSS conflicts
   - Ensure Tailwind CSS is loading

3. **JavaScript Errors**
   - Check browser console
   - Verify all scripts are loading
   - Ensure proper module imports

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📞 Support

For support and questions:
- Email: support@neomart.com
- Documentation: Check this README
- Issues: Create GitHub issue

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added contact page and FAQ section
- **v1.2.0** - Enhanced mobile responsiveness

---

**NeoMart** - Modern eCommerce Experience 🛍️