import * as adm from 'firebase-admin';
var serviceAccount = require('../serviceAccountKey.json');

const admin= adm.initializeApp({
  credential: adm.credential.cert(serviceAccount),
  databaseURL: 'https://test-742c5.firebaseio.com'
});

export default admin;