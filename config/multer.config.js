const multer = require('multer')
const firebaseStorage = require('multer-firebase-storage')
const firebase = require('./firebase.config')
const serviceAccount = require('../drive-443c5-firebase-adminsdk-fbsvc-00565506a8.json')

const storage = firebaseStorage({
    credentials: firebase.credential.cert(serviceAccount),
    bucketName: 'drive-443c5.firebasestorage.app',
    unique: true,
})

const upload = multer({ storage })

module.exports = upload
