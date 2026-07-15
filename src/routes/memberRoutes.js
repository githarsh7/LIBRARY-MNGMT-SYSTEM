const express = require('express');
const router = express.Router();
const { addMember, getAllMembers } = require('../controllers/memberController');

router.post('/', addMember);
router.get('/', getAllMembers);

module.exports = router;
