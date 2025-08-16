
# FSOCIETY HOSTING 🚀

A full-stack web hosting platform that allows users to deploy websites instantly. Similar to Vercel, users can upload files, paste code, or import from URLs to create hosted websites with unique links.

![FSOCIETY HOSTING](https://img.shields.io/badge/FSOCIETY-HOSTING-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## ✨ Features

- **📁 File Upload Deployment**: Upload HTML, CSS, JS files or complete projects
- **📝 Code Paste Deployment**: Paste code directly and deploy instantly
- **🔗 URL Import Deployment**: Import and deploy websites from URLs
- **👁️ Live Preview**: Preview your sites before deployment
- **🔐 Admin Panel**: Secure admin authentication with project management
- **📊 Analytics**: Track deployment statistics and usage
- **🎨 Professional UI**: Dark theme with blue/purple gradients
- **⚡ Instant Deployment**: Get unique URLs immediately after deployment
- **💾 Database Integration**: PostgreSQL for robust data management

## 🏗️ System Architecture

### Backend Architecture
- **Node.js/Express Server**: RESTful API handling file uploads, code deployment, and URL imports
- **PostgreSQL Database**: Stores hosted site metadata, tracking creation dates, file counts, and usage statistics
- **File System Management**: Organized storage of uploaded files and deployed sites in isolated directories
- **Multi-deployment Support**: Handles three deployment methods - file uploads, direct code input, and URL imports

### Frontend Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Terminal**: Live deployment logs and progress tracking
- **Preview Modal**: Test your sites before going live
- **Admin Dashboard**: Comprehensive management interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnreesekenya2/fsociety-hosting.git
   cd fsociety-hosting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/fsociety_hosting
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 🌐 Deployment on Render

### Step 1: Prepare Your Repository

1. Push your code to GitHub (this repository)
2. Ensure all dependencies are listed in `package.json`

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up or log in with your GitHub account

### Step 3: Deploy Database

1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure your database:
   - **Name**: `fsociety-hosting-db`
   - **Database**: `fsociety_hosting`
   - **User**: `fsociety_user`
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. **Save the connection details** - you'll need the External Database URL

### Step 4: Deploy Web Service

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository: `https://github.com/johnreesekenya2/fsociety-hosting`
4. Configure the service:

   **Basic Settings:**
   - **Name**: `fsociety-hosting`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

   **Environment Variables:**
   ```
   DATABASE_URL=<your-postgres-external-url-from-step-3>
   PORT=5000
   ```

5. Click "Create Web Service"

### Step 5: Configure Domain (Optional)

1. In your service dashboard, go to "Settings"
2. Scroll to "Custom Domains"
3. Add your custom domain if you have one

### Step 6: Verify Deployment

1. Wait for the build to complete (usually 2-3 minutes)
2. Click on your service URL to test the application
3. Test all deployment methods:
   - File upload
   - Code paste
   - URL import

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port (default: 5000) | No |

## 📁 Project Structure

```
fsociety-hosting/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/
│   └── index.html         # Frontend application
├── hosted-sites/          # Deployed user sites
├── uploads/               # Temporary upload storage
├── server/
│   └── db.ts             # Database utilities
└── README.md             # This file
```

## 🔐 Admin Access

**Default Admin Credentials:**
- **Username**: `JOHNREESE`
- **Password**: `fsociety2025`

⚠️ **Important**: Change these credentials in production by modifying the authentication logic in `public/index.html`.

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main application |
| `POST` | `/api/upload` | Upload files for deployment |
| `POST` | `/api/deploy-code` | Deploy code directly |
| `POST` | `/api/deploy-url` | Deploy from URL |
| `GET` | `/api/sites` | Get all hosted sites |
| `GET` | `/api/site/:id/info` | Get site information |
| `DELETE` | `/api/site/:id` | Delete a site |
| `GET` | `/site/:id` | Access deployed site |
| `GET` | `/api/admin/stats` | Admin statistics |

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Handling**: Multer, fs-extra
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: Custom admin authentication
- **Styling**: Custom CSS with dark theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **File Upload Issues**
   - Check file size limits (50MB max)
   - Verify `uploads/` directory permissions
   - Ensure sufficient disk space

3. **Deployment Fails on Render**
   - Check build logs in Render dashboard
   - Verify all environment variables are set
   - Ensure `package.json` has correct dependencies

### Getting Help

- Check the [Issues](https://github.com/johnreesekenya2/fsociety-hosting/issues) page
- Create a new issue with detailed error information
- Include logs and environment details

## 🌟 Acknowledgments

- Inspired by modern hosting platforms like Vercel and Netlify
- Built with performance and user experience in mind
- Designed for developers who need quick deployment solutions

---

**Made with ❤️ by the FSOCIETY team**

For more information or support, please visit our [GitHub repository](https://github.com/johnreesekenya2/fsociety-hosting).
