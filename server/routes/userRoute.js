const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();


router.get("/", userController.getAll);
router.post("/login", userController.login);
router.post("/:userId/logout", userController.logout);
router.get("/:userId/playlists", userController.playlists);
router.delete("/:userId/playlists/:songId", userController.removePlaylist);
router.post("/:userId/playlists/:songId", userController.addPlaylist);

module.exports = router;
