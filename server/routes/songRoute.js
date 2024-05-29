const express = require("express");
const songController = require("../controllers/songController");


const router = express.Router();

router.get("/", songController.getAll);
router.post("/", songController.add);
router.put("/:id", songController.update);
router.delete("/:id", songController.delete);

module.exports = router;
