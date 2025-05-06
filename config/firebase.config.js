const Firebase = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    storageBucket: 'drive-443c5.firebasestorage.app'
})

module.exports = Firebase
