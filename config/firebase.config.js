const Firebase = require('firebase-admin')

const serviceAccount = require('../drive-443c5-firebase-adminsdk-fbsvc-00565506a8.json')

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    storageBucket: 'drive-443c5.firebasestorage.app'
})

module.exports = Firebase
