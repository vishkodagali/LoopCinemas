const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.username);
  res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.username);
  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};


// Create a user in the database.
exports.create = async (req, res) => {
  //const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  try {
    if (!req.body.password || req.body.password.trim() === '') {
      // If password is not provided or is empty, return an error response
      return res.status(400).json({ error: 'Password is required' });
    }
  
    // If password is available, proceed to hash it and create the user
    const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
    
    
    const user = await db.user.create({
      username: req.body.username,
      password_hash: hash,
      email: req.body.email,
      role: "user",
      isBlocked:0
      //last_name: req.body.lastname
    });
  
  
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Error creating user' });
  }

};

exports.update = async (req, res) => {
  const username = req.params.username;
  const updatedFields = req.body;
  
  try {
    const user = await db.user.findByPk(username);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (updatedFields.password) {
      updatedFields.password_hash = await argon2.hash(updatedFields.password, { type: argon2.argon2id });
      delete updatedFields.password;
    }
    await user.update(updatedFields);

    const user1 = await db.user.findByPk(username);


    res.status(200);
    res.json(user1)
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ message: 'Error updating user' });
  }
};

exports.delete = async (req, res) => {
  const username = req.params.username;

  try {
    // Find the user by username
    const user = await db.user.findByPk(username);

    // If user is not found, send a 404 response
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    // Send a success response
    res.send({ message: 'User was deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: 'Error deleting user with username ' + username });
  }
};

