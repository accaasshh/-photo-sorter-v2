const express = require("express");
const router = express.Router();

const db = require("../db/database");
const upload = require("../config/multer");

// ==========================
// Upload Images
// ==========================

router.post("/upload", upload.array("photos", 100), (req, res) => {

    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No images selected."
        });
    }

    files.forEach((file) => {

        db.run(
            `
            INSERT INTO photos
            (filename, originalName)
            VALUES (?, ?)
            `,
            [
                file.filename,
                file.originalname
            ]
        );

    });

    res.json({
        success: true,
        message: "Images uploaded successfully."
    });

});

// ==========================
// Get Photos
// ==========================

router.get("/photos", (req, res) => {

    db.all(

        `
        SELECT *
        FROM photos
        ORDER BY
            CASE
                WHEN status = 'INACTIVE' THEN 0
                ELSE 1
            END,
            id DESC
        `,

        [],

        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }

    );

});

// ==========================
// Toggle Status
// ==========================

router.patch("/photos/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    db.run(

        `
        UPDATE photos
        SET status = ?
        WHERE id = ?
        `,

        [status, id],

        function (err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Status updated successfully"
            });

        }

    );

});

// ==========================
// Delete Photo
// ==========================

router.delete("/photos/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        `
        DELETE FROM photos
        WHERE id = ?
        `,

        [id],

        function (err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Photo deleted successfully"
            });

        }

    );

});

module.exports = router;