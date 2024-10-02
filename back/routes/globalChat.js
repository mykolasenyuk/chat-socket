const {addGlobalMessage, getGlobalMessages} = require("../controllers/globalChat");
const router = require("express").Router();

router.post("/addmsg/", addGlobalMessage);
router.post("/getmsg/", getGlobalMessages);

module.exports = router;