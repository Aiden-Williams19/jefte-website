# Photographer/Editor Portfolio Website

A modern, responsive portfolio website for photographers and video editors featuring:
- Beautiful portfolio gallery with category filtering
- Booking form for client inquiries
- Responsive design for all devices

## Features

- **Portfolio Gallery**: Organized by categories (Weddings, Commercial, Corporate, Matric Balls, Videos, Normal/Portrait)
- **Booking System**: Comprehensive booking form with validation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, professional design with smooth animations

## Technologies Used

- React 18
- HTML5
- CSS3
- JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Header.js
│   ├── Hero.js
│   ├── Portfolio.js
│   ├── BookingForm.js
│   └── Footer.js
├── data/
│   └── portfolioData.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Customization

### Adding Portfolio Images

Edit `src/data/portfolioData.js` to add your own portfolio items. Replace the placeholder image URLs with your actual images.

### Styling

All component styles are in their respective `.css` files. The main color scheme uses purple gradients, which can be customized in the CSS files.

### Form Submission

Currently, the booking form logs to the console. To integrate with a backend:
1. Replace the setTimeout in `BookingForm.js` with an actual API call
2. Set up your backend endpoint
3. Handle form submissions accordingly

## License

This project is open source and available for personal and commercial use.
