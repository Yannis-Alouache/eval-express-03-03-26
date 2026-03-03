const getAllUsers = (req, res) => {
  console.log('GET /users - Fetching all users');
  res.json([]);
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  console.log('POST /users - Creating user:', { name, email });

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  res.status(201).json({ name, email });
};

module.exports = {
  getAllUsers,
  createUser,
};
