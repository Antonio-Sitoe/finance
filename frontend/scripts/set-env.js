const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || '/api';

const content = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)},
}
`;

fs.writeFileSync(path.join(__dirname, '../src/environments/environment.prod.ts'), content);
console.log(`environment.prod.ts gerado com apiUrl=${apiUrl}`);
