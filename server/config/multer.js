const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, "uploads/");
    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    }

});

const fileFilter = (req, file, cb) => {

    const allowed =
        /jpg|jpeg|png|webp|gif/i;

    const ext =
        path.extname(file.originalname);

    if (allowed.test(ext)) {

        cb(null, true);

    } else {

        cb(new Error("Only images allowed"));

    }

};

module.exports = multer({

    storage,
    fileFilter

});