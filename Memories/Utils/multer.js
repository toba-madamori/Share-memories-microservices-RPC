const multer = require('multer')
const path = require('path')
const maxSize = 1 * 5000 * 1000

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return cb(new Error('File type is not supported'), false)
    }
    cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: maxSize } })
module.exports = upload
