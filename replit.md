# Stock Price Checker

## Overview
A Node.js/Express application for checking NASDAQ stock prices with a like system. This is a freeCodeCamp Information Security project.

## Project Structure
- `server.js` - Main Express server entry point
- `routes/api.js` - Stock price API endpoint (`/api/stock-prices`)
- `routes/fcctesting.js` - freeCodeCamp testing routes
- `views/index.html` - Frontend HTML page
- `public/` - Static assets (CSS, JS)
- `tests/` - Functional tests

## API Endpoints
- `GET /api/stock-prices?stock=GOOG` - Get single stock price
- `GET /api/stock-prices?stock=GOOG&like=true` - Like a stock
- `GET /api/stock-prices?stock=GOOG&stock=MSFT` - Compare two stocks

## Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to 'test' to run automated tests

## Running the Application
```bash
npm start
```

## Recent Changes
- December 12, 2025: Configured for Replit environment
  - Updated server to bind to 0.0.0.0:5000
  - Configured CSP headers to allow Replit iframe embedding
