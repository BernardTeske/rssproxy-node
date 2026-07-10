const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

function fetchFeed(targetUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const client = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      method: 'GET',
      agent: url.protocol === 'https:' ? httpsAgent : undefined,
    };

    const req = client.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = requestUrl.searchParams.get('feed');

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Missing "feed" query parameter');
    return;
  }

  try {
    const { statusCode, body } = await fetchFeed(targetUrl);

    res.writeHead(statusCode, {
      'Content-Type': 'text/xml;charset=UTF-8',
    });
    res.end(body);
  } catch (error) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end(`Failed to fetch feed: ${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`RSS proxy listening on http://localhost:${PORT}`);
});
