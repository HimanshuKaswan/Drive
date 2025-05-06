const express = require('express');
const upload = require('../config/multer.config')
const fileModel = require('../models/file.model')
const firebase = require('../config/firebase.config')

const auth = require('../middleware/auth')

const router = express.Router();


router.get('/', auth, async (req, res) => {

    const userFiles = await fileModel.find({ user: req.user.userId })

    console.log(userFiles);
    res.render('home', { userFiles })
})

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    const file = await fileModel.create({
        path: req.file.path,
        originalName: req.file.originalname,
        user: req.user.userId
    })
    await file.save()
    res.redirect('/')
})

router.get('/download/:path', auth, async (req, res) => {


    const loggedInUser = req.user.userId
    const path = req.params.path

    const file = await fileModel.findOne({ path, user: loggedInUser })
    if (!file) {
        return res.status(404).json({ message: 'unauthorized' })
    }

    const signedUrl = await firebase.storage().bucket().file(file.path).getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 1000
    })

    res.redirect(signedUrl[0])
})

router.get('/delete/:path', auth, async (req, res) => {
    try {
        const loggedInUser = req.user.userId
        const path = req.params.path
        
        // Find file before deleting to get path
        const file = await fileModel.findOne({ path, user: loggedInUser });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete from database
        await fileModel.findOneAndDelete({ path, user: loggedInUser });

        res.status(200).redirect('/')
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
})

module.exports = router;