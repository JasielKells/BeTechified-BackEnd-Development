const os = require('os');

const logger = (req, res, next) => {
   // Skip logging for favicon requests
  if (req.url === '/favicon.ico') {
    return next();
  }


    const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  // Get IP - works with proxies
  const clientIp = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   req.ip;
  
  // Parse user agent manually
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const browserInfo = parseUserAgent(userAgent);
  
  // Main log header
  console.log(`[${timestamp}] ${method} ${url}`);
  console.log(`  IP: ${clientIp}`);
  console.log(`  Browser: ${browserInfo.browser}`);
  console.log(`  OS: ${browserInfo.os}`);
  
  // Safely log request body
  try {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      console.log('  Body:', JSON.stringify(req.body, null, 2));
    }
  } catch (err) {
    console.log('  Body: [Unable to parse]');
  }
  
  // Safely log request params
  try {
    if (req.params && typeof req.params === 'object' && Object.keys(req.params).length > 0) {
      console.log('  Params:', req.params);
    }
  } catch (err) {
    console.log('  Params: [Unable to parse]');
  }
  
  // Safely log request query
  try {
    if (req.query && typeof req.query === 'object' && Object.keys(req.query).length > 0) {
      console.log('  Query:', req.query);
    }
  } catch (err) {
    console.log('  Query: [Unable to parse]');
  }
  
  // Log response status when finished
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`  Response Status: ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
};

// Improved user agent parser
function parseUserAgent(ua) {
  let browser = 'Unknown';
  let os = 'Unknown';
  
  // Convert to lowercase for easier matching
  const uaLower = ua.toLowerCase();
  
  // ===== DETECT BROWSER =====
  if (uaLower.includes('chrome') && !uaLower.includes('edg') && !uaLower.includes('opr')) {
    browser = 'Chrome';
  } else if (uaLower.includes('firefox') && !uaLower.includes('seamonkey')) {
    browser = 'Firefox';
  } else if (uaLower.includes('safari') && !uaLower.includes('chrome') && !uaLower.includes('android')) {
    browser = 'Safari';
  } else if (uaLower.includes('edg') || uaLower.includes('edge')) {
    browser = 'Edge';
  } else if (uaLower.includes('opr') || uaLower.includes('opera')) {
    browser = 'Opera';
  } else if (uaLower.includes('brave')) {
    browser = 'Brave';
  } else if (uaLower.includes('postman')) {
    browser = 'Postman';
  } else if (uaLower.includes('curl')) {
    browser = 'cURL';
  } else if (uaLower.includes('insomnia')) {
    browser = 'Insomnia';
  } else if (uaLower.includes('thunder')) {
    browser = 'Thunder Client';
  } else if (uaLower.includes('mozilla') && !uaLower.includes('chrome') && !uaLower.includes('safari')) {
    browser = 'Mozilla';
  }
  
  // ===== DETECT OPERATING SYSTEM =====
  if (uaLower.includes('windows nt 10.0')) {
    os = 'Windows 10';
  } else if (uaLower.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (uaLower.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (uaLower.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (uaLower.includes('windows nt 6.0')) {
    os = 'Windows Vista';
  } else if (uaLower.includes('windows nt 5.1')) {
    os = 'Windows XP';
  } else if (uaLower.includes('windows')) {
    os = 'Windows';
  } else if (uaLower.includes('mac os x 10_15')) {
    os = 'macOS Catalina';
  } else if (uaLower.includes('mac os x 10_14')) {
    os = 'macOS Mojave';
  } else if (uaLower.includes('mac os x 10_13')) {
    os = 'macOS High Sierra';
  } else if (uaLower.includes('mac os x 10_12')) {
    os = 'macOS Sierra';
  } else if (uaLower.includes('mac os x')) {
    os = 'macOS';
  } else if (uaLower.includes('iphone') || uaLower.includes('ipad')) {
    os = 'iOS';
  } else if (uaLower.includes('android')) {
    os = 'Android';
  } else if (uaLower.includes('linux')) {
    os = 'Linux';
  } else if (uaLower.includes('ubuntu')) {
    os = 'Ubuntu';
  } else if (uaLower.includes('debian')) {
    os = 'Debian';
  } else if (uaLower.includes('fedora')) {
    os = 'Fedora';
  } else if (uaLower.includes('centos')) {
    os = 'CentOS';
  } else if (uaLower.includes('freebsd')) {
    os = 'FreeBSD';
  } else if (uaLower.includes('openbsd')) {
    os = 'OpenBSD';
  } else if (uaLower.includes('sunos')) {
    os = 'Solaris';
  }
  
  return { browser, os };
}

module.exports = logger;