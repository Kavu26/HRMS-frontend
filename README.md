# HRMS Lite - Frontend Application

## Project Overview

HRMS Lite Frontend is a modern, responsive web application built with React for managing employee records and tracking attendance. The application provides an intuitive interface for HR administrators to perform essential HR operations with ease.

### Key Features

- **Dashboard**: Overview of employees and attendance statistics
- **Employee Management**: Add, view, and delete employees
- **Attendance Management**: Mark attendance, view records, edit, and delete entries
- **Date Filtering**: Filter attendance by single date or date range
- **Employee Filtering**: Filter attendance records by specific employee
- **Responsive Design**: Fully responsive design optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, professional interface with intuitive navigation

## Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.21.1
- **HTTP Client**: Axios 1.6.5
- **Styling**: Custom CSS with CSS Variables
- **Node.js**: 18+ (recommended)

## Project Structure

```
Frontend-HRMS/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Dashboard with statistics
│   │   ├── EmployeeManagement.jsx # Employee CRUD operations
│   │   └── AttendanceManagement.jsx # Attendance management
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Steps to Run the Project Locally

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend-HRMS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   
   If not set, it defaults to `http://localhost:8000`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### Build for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Deploy:**
   - The `dist` folder contains the production-ready files
   - Deploy this folder to Vercel, Netlify, or any static hosting service

## Environment Variables

- `VITE_API_URL`: Backend API base URL
  - Default: `http://localhost:8000`
  - Example for production: `https://your-backend-api.onrender.com`

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## Features in Detail

### Dashboard
- Total employees count
- Total attendance records count
- Employee attendance summary table showing present/absent days per employee

### Employee Management
- Add new employees with validation
- View all employees in a table
- Delete employees (with confirmation)
- Real-time updates after operations

### Attendance Management
- Mark attendance for employees
- View all attendance records
- Filter by employee
- Filter by date (single date or date range)
- Edit existing attendance records
- Delete attendance records (with confirmation)
- Real-time updates after operations

### Responsive Design
- **Desktop**: Full-featured table layouts
- **Tablet**: Optimized spacing and font sizes
- **Mobile**: Horizontal scrollable tables with touch-friendly buttons

## API Integration

The frontend communicates with the backend API through the service layer (`src/services/api.js`). All API calls use Axios for HTTP requests.

### API Endpoints Used

- Employee endpoints: `/api/employees`
- Attendance endpoints: `/api/attendance`
- Health check: `/health`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import the project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
6. Deploy

## Assumptions & Limitations

### Assumptions

1. **Backend Available**: Assumes backend API is running and accessible
2. **Single Admin**: No user authentication or role-based access
3. **Modern Browser**: Assumes users have modern browsers with JavaScript enabled
4. **Network**: Assumes stable network connection for API calls

### Limitations

1. **No Offline Support**: Application requires an active connection to the backend
2. **No Data Caching**: Data is fetched fresh on every page load
3. **No Pagination**: All records are loaded at once (may be slow with large datasets)
4. **No Employee Edit**: Employees cannot be edited, only deleted and recreated
5. **No Bulk Operations**: Operations must be performed one at a time
6. **Limited Error Recovery**: Basic error handling without advanced retry logic
7. **No Data Export**: No functionality to export data to CSV/Excel

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend is running
   - Verify `VITE_API_URL` is correct
   - Check CORS settings on backend

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version` (should be 18+)

3. **Styling Issues**
   - Clear browser cache
   - Check if CSS files are loading correctly

## License

This project is developed as part of an HRMS Lite assignment.
