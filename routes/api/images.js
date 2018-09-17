const router = require("express").Router();
const gridFS = require('../../gridfs');
const mongoose = require('mongoose');


const { gfs, upload } = gridFS;

router.post('/upload', upload.single('image'), (req, res) => {
   res.json({file: req.file});
});

router.get('/:id', (req, res) => {
    gfs.files.findOne({ '_id': ObjectId(req.params.id) }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        };

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file._id);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        };
    });
});

router.delete('/:id', (req, res) => {
    gfs.remove({'_id': ObjectId(req.params.id), root: 'uploads'}, (err, gfsStore) => {
        if(err) {
            return res.status(404).json({err: err});
        }
    })
});

module.exports = router;