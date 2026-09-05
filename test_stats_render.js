const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');

// Basic syntax check with node
try {
  new Function(appJs);
  console.log('app.js syntax is 100% valid!');
} catch (e) {
  console.error('app.js syntax error:', e);
}
