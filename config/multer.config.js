const multer = require('multer')
const firebaseStorage = require('multer-firebase-storage')
const firebase = require('./firebase.config')
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

const storage = firebaseStorage({
    credentials: firebase.credential.cert(serviceAccount),
    bucketName: 'drive-443c5.firebasestorage.app',
    unique: true,
})

const upload = multer({ storage })

module.exports = upload
