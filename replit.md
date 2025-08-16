# Overview

FSOCIETY HOSTING is a full-stack web hosting platform that allows users to deploy websites instantly. Similar to Vercel, users can upload files, paste code, or import from URLs to create hosted websites with unique links. Features include preview functionality, admin panel with authentication, loading animations, and John Reese character animations. Built with Node.js, Express, PostgreSQL, and a professional dark theme with blue/purple gradients.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Node.js/Express Server**: RESTful API handling file uploads, code deployment, and URL imports
- **PostgreSQL Database**: Stores hosted site metadata, tracking creation dates, file counts, and usage statistics
- **File System Management**: Organized storage of uploaded files and deployed sites in isolated directories
- **Multi-deployment Support**: Handles three deployment methods - file uploads, direct code input, and URL imports

## Frontend Architecture
- **Professional Dark Theme**: Modern interface with blue/purple gradients and sleek animations
- **Responsive Design**: Mobile-first approach with CSS Grid for deployment cards and site listings
- **Real-time Feedback**: Progress bars, terminal logs, and success/error alerts for user interaction
- **AJAX Integration**: Asynchronous form submissions and dynamic site management without page reloads
- **Admin Panel**: Secure sidebar with authentication (username: JOHNREESE, password: fsociety2025)
- **Preview Functionality**: View code and files before deployment in modal windows
- **Loading Animations**: Smooth loading screens and John Reese character animations
- **Sidebar Navigation**: Collapsible admin panel with statistics and site management

## Deployment System
- **UUID-based Site IDs**: Unique identifiers for each deployed site ensuring no conflicts
- **Multi-format Support**: Handles HTML, CSS, JS, images, and other web assets
- **Automatic Routing**: Serves index.html by default, with fallback to first available HTML file
- **Database Tracking**: Monitors site creation, access times, file counts, and storage usage

## Security Features
- **File Size Limits**: 50MB maximum upload to prevent abuse
- **Input Validation**: Server-side validation for all user inputs and file types
- **Path Security**: Prevents directory traversal attacks in file serving
- **Database Prepared Statements**: SQL injection prevention through parameterized queries
- **Admin Authentication**: Hardcoded credentials for admin panel access
- **Session Management**: Client-side login state management for admin functions

# External Dependencies

## Backend Dependencies
- **express**: Web application framework for Node.js
- **multer**: Middleware for handling multipart/form-data file uploads
- **uuid**: Generation of unique identifiers for hosted sites
- **fs-extra**: Enhanced file system operations with promise support
- **pg**: PostgreSQL client for Node.js database operations
- **node-fetch**: HTTP client for importing content from external URLs
- **cors**: Cross-Origin Resource Sharing middleware
- **archiver**: File compression utilities
- **extract-zip**: ZIP file extraction capabilities

## Database
- **PostgreSQL**: Persistent data storage for site metadata and statistics
- **hosted_sites table**: Tracks site information including ID, name, type, creation date, and file statistics

## Frontend Technologies
- **Vanilla JavaScript**: No frameworks, pure DOM manipulation and AJAX
- **CSS3**: Advanced styling with animations, gradients, responsive design, and loading screens
- **HTML5**: Modern markup with form handling, file upload capabilities, and modal windows
- **File API**: Client-side file preview using FileReader and Blob objects
- **CSS Animations**: Keyframe animations for loading spinners, character animations, and transitions