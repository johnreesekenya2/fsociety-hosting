const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');
const fetch = require('node-fetch');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure directories exist
fs.ensureDirSync('uploads');
fs.ensureDirSync('hosted-sites');
fs.ensureDirSync('public');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hosted_sites (
        id SERIAL PRIMARY KEY,
        site_id VARCHAR(36) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        file_count INTEGER DEFAULT 0,
        size_bytes BIGINT DEFAULT 0
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Routes

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload files endpoint
app.post('/api/upload', upload.array('files', 50), async (req, res) => {
  try {
    const { projectName } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const siteId = uuidv4();
    const sitePath = path.join('hosted-sites', siteId);
    
    await fs.ensureDir(sitePath);
    
    let totalSize = 0;
    
    // Copy uploaded files to site directory
    for (const file of files) {
      const destPath = path.join(sitePath, file.originalname);
      await fs.copy(file.path, destPath);
      await fs.remove(file.path); // Clean up temp file
      totalSize += file.size;
    }
    
    // Store in database
    await pool.query(
      'INSERT INTO hosted_sites (site_id, name, type, file_count, size_bytes) VALUES ($1, $2, $3, $4, $5)',
      [siteId, projectName || 'Untitled Project', 'upload', files.length, totalSize]
    );
    
    res.json({
      success: true,
      siteId: siteId,
      url: `${req.protocol}://${req.get('host')}/site/${siteId}`,
      message: 'Files uploaded successfully'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Deploy from URL endpoint
app.post('/api/deploy-url', async (req, res) => {
  try {
    const { url, projectName } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const siteId = uuidv4();
    const sitePath = path.join('hosted-sites', siteId);
    
    await fs.ensureDir(sitePath);
    
    // Fetch content from URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    let content, fileName, size = 0;
    
    if (contentType && contentType.includes('text/html')) {
      content = await response.text();
      fileName = 'index.html';
      size = Buffer.byteLength(content);
    } else if (contentType && contentType.includes('application/json')) {
      content = await response.text();
      fileName = 'data.json';
      size = Buffer.byteLength(content);
    } else {
      // Try to get as text anyway
      content = await response.text();
      fileName = 'index.html';
      size = Buffer.byteLength(content);
    }
    
    // Save content to file
    await fs.writeFile(path.join(sitePath, fileName), content);
    
    // Store in database
    await pool.query(
      'INSERT INTO hosted_sites (site_id, name, type, file_count, size_bytes) VALUES ($1, $2, $3, $4, $5)',
      [siteId, projectName || 'URL Project', 'url', 1, size]
    );
    
    res.json({
      success: true,
      siteId: siteId,
      url: `${req.protocol}://${req.get('host')}/site/${siteId}`,
      message: 'URL deployed successfully'
    });
    
  } catch (error) {
    console.error('Deploy URL error:', error);
    res.status(500).json({ error: 'Failed to deploy URL: ' + error.message });
  }
});

// Deploy from code endpoint
app.post('/api/deploy-code', async (req, res) => {
  try {
    const { code, projectName, filename } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const siteId = uuidv4();
    const sitePath = path.join('hosted-sites', siteId);
    
    await fs.ensureDir(sitePath);
    
    const fileName = filename || 'index.html';
    const size = Buffer.byteLength(code);
    
    // Save code to file
    await fs.writeFile(path.join(sitePath, fileName), code);
    
    // Store in database
    await pool.query(
      'INSERT INTO hosted_sites (site_id, name, type, file_count, size_bytes) VALUES ($1, $2, $3, $4, $5)',
      [siteId, projectName || 'Code Project', 'code', 1, size]
    );
    
    res.json({
      success: true,
      siteId: siteId,
      url: `${req.protocol}://${req.get('host')}/site/${siteId}`,
      message: 'Code deployed successfully'
    });
    
  } catch (error) {
    console.error('Deploy code error:', error);
    res.status(500).json({ error: 'Failed to deploy code' });
  }
});

// Serve hosted sites
app.get('/site/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    const requestedPath = '';
    
    // Update last accessed
    await pool.query('UPDATE hosted_sites SET last_accessed = CURRENT_TIMESTAMP WHERE site_id = $1', [siteId]);
    
    const sitePath = path.join('hosted-sites', siteId);
    
    if (!await fs.pathExists(sitePath)) {
      return res.status(404).send('Site not found');
    }
    
    // Always try index.html first for main site access
    let filePath = path.join(sitePath, 'index.html');
    
    // If index.html doesn't exist, show directory listing or first HTML file
    if (!await fs.pathExists(filePath)) {
      const files = await fs.readdir(sitePath);
      const htmlFiles = files.filter(f => f.endsWith('.html'));
      
      if (htmlFiles.length > 0) {
        filePath = path.join(sitePath, htmlFiles[0]);
      } else {
        // Return first file or directory listing
        if (files.length > 0) {
          filePath = path.join(sitePath, files[0]);
        } else {
          return res.status(404).send('No files found in site');
        }
      }
    }
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.error('Serve site error:', error);
    res.status(500).send('Error serving site');
  }
});

// Serve specific files from hosted sites
app.get('/site/:siteId/:filename', async (req, res) => {
  try {
    const { siteId, filename } = req.params;
    
    // Update last accessed
    await pool.query('UPDATE hosted_sites SET last_accessed = CURRENT_TIMESTAMP WHERE site_id = $1', [siteId]);
    
    const sitePath = path.join('hosted-sites', siteId);
    const filePath = path.join(sitePath, filename);
    
    if (!await fs.pathExists(sitePath)) {
      return res.status(404).send('Site not found');
    }
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).send('File not found');
    }
    
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.error('Serve file error:', error);
    res.status(500).send('Error serving file');
  }
});

// Get site info
app.get('/api/site/:siteId/info', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    const result = await pool.query('SELECT * FROM hosted_sites WHERE site_id = $1', [siteId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    const site = result.rows[0];
    const sitePath = path.join('hosted-sites', siteId);
    
    let files = [];
    if (await fs.pathExists(sitePath)) {
      const fileList = await fs.readdir(sitePath);
      files = fileList.map(f => ({ name: f, path: `/site/${siteId}/${f}` }));
    }
    
    res.json({
      ...site,
      files: files,
      url: `${req.protocol}://${req.get('host')}/site/${siteId}`
    });
    
  } catch (error) {
    console.error('Get site info error:', error);
    res.status(500).json({ error: 'Failed to get site info' });
  }
});

// Get all hosted sites
app.get('/api/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hosted_sites ORDER BY created_at DESC');
    
    const sites = result.rows.map(site => ({
      ...site,
      url: `${req.protocol}://${req.get('host')}/site/${site.site_id}`
    }));
    
    res.json(sites);
    
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({ error: 'Failed to get sites' });
  }
});

// Delete site
app.delete('/api/site/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Remove from database
    const result = await pool.query('DELETE FROM hosted_sites WHERE site_id = $1 RETURNING *', [siteId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    // Remove files
    const sitePath = path.join('hosted-sites', siteId);
    if (await fs.pathExists(sitePath)) {
      await fs.remove(sitePath);
    }
    
    res.json({ success: true, message: 'Site deleted successfully' });
    
  } catch (error) {
    console.error('Delete site error:', error);
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

// Admin statistics endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalSitesResult = await pool.query('SELECT COUNT(*) as count FROM hosted_sites');
    const uploadsResult = await pool.query('SELECT COUNT(*) as count FROM hosted_sites WHERE type = $1', ['upload']);
    const codesResult = await pool.query('SELECT COUNT(*) as count FROM hosted_sites WHERE type = $1', ['code']);
    const urlsResult = await pool.query('SELECT COUNT(*) as count FROM hosted_sites WHERE type = $1', ['url']);
    
    const stats = {
      totalSites: parseInt(totalSitesResult.rows[0].count),
      uploads: parseInt(uploadsResult.rows[0].count),
      codes: parseInt(codesResult.rows[0].count),
      urls: parseInt(urlsResult.rows[0].count)
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to get admin stats' });
  }
});

// Admin sites management endpoint
app.get('/api/admin/sites', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT site_id, name, type, created_at, last_accessed, file_count, size_bytes 
      FROM hosted_sites 
      ORDER BY created_at DESC
    `);
    
    const sites = result.rows.map(site => ({
      ...site,
      url: `${req.protocol}://${req.get('host')}/site/${site.site_id}`,
      created_at: new Date(site.created_at).toLocaleString(),
      last_accessed: new Date(site.last_accessed).toLocaleString(),
      size_mb: (site.size_bytes / (1024 * 1024)).toFixed(2)
    }));
    
    res.json(sites);
    
  } catch (error) {
    console.error('Admin sites error:', error);
    res.status(500).json({ error: 'Failed to get admin sites' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`FSOCIETY HOSTING server running on port ${PORT}`);
  await initDatabase();
});

module.exports = app;