const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { URL } = require('url');

const app = express();
const PORT = 3000;

// Enable CORS to allow your frontend to call this API
app.use(cors());

// Simple route to proxy an external URL
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('Missing url query parameter');
  }

  // Validate URL format
  try {
    new URL(targetUrl);
  } catch (_) {
    return res.status(400).send('Invalid URL');
  }

  try {
    // Fetch the external URL's content
    const response = await fetch(targetUrl);

    // Check content-type to only allow html
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return res.status(400).send('URL does not point to an HTML page');
    }

    // Get text content (HTML)
    const html = await response.text();

    // OPTIONAL: modify HTML here if desired (e.g., rewrite links)

    // Return the fetched HTML back to client
    res.set('Content-Type', 'text/html');
    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch URL');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
