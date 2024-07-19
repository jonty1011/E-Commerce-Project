//  Here creating a file to upload images of our product 

import multer from 'multer';
import {v4 as uuid} from "uuid"

const storage = multer.diskStorage({

    // destination function is function specifies where to store the uploaded files.
    destination(req,file,cb){
        // the image file will be saved in uploads folder
        cb(null,"uploads");  //callback sets the destination to the "uploads" folder.
    },

    filename(req,file,cb){    // --->> it  specifies the filename for the uploaded file.
        // this will create a random unique id 

        // unique identifier --> uuid
        const id = uuid();

        const extName = file.originalname.split(".").pop();   // Extracts the file extension from the original filename.

        const filename = `${id}.${extName}`  //Combines the unique identifier with the original file extension to create a new unique filename.

        cb(null, filename);  // this is callback which sets new filename.
    }
});     

export const uploadFiles = multer({storage}).single("image")



// const express = require('express');
// const multer = require('multer');

// const app = express();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// const upload = multer({ storage: storage });

// app.post('/upload', upload.single('image'), (req, res) => {
//     res.send('File uploaded successfully');
// });

// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });
