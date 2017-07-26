
const app = require('app.js');

let server = app.listen(app.get('port'));
console.log(`Server listening on port: ${server.address().port}`);
