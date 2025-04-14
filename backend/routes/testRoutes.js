const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authTokenValidation");

// To test JWT token, should work only if valid JWT token is provided
router.get("/testauth", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Auth token OK!",
        user: req.user,
    });
});

module.exports = router;