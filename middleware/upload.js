import multer from "multer";

// storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");   // 👈 kaha save hoga
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // unique name
    }
});

// multer export
export const upload = multer({ storage });