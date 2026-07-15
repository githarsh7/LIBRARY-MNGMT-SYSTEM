const { members, getNextMemberId } = require('../data/store');
const { getMissingFields } = require('../utils/validate');

// POST /api/library/members
const addMember = (req, res) => {
  const { name, email, phone } = req.body;

  const missing = getMissingFields(req.body, ['name', 'email', 'phone']);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required field(s): ${missing.join(', ')}`
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  const newMember = {
    id: getNextMemberId(),
    name: String(name),
    email: String(email),
    phone: String(phone)
  };

  members.push(newMember);

  return res.status(201).json({ success: true, data: newMember });
};

// GET /api/library/members
const getAllMembers = (req, res) => {
  return res.status(200).json(members);
};

module.exports = { addMember, getAllMembers };
