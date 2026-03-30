// user.model.js - In-memory storage model for Users
const { v4: uuidv4 } = require('uuid');

// In-memory store (simulates a database)
const users = [];

/**
 * User model with helper methods
 */
const UserModel = {
  /**
   * Find all users (returns without passwords)
   */
  findAll() {
    return users.map(({ password, ...user }) => user);
  },

  /**
   * Find a user by ID
   */
  findById(id) {
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Find a user by email (includes password for auth)
   */
  findByEmail(email) {
    return users.find((u) => u.email === email.toLowerCase()) || null;
  },

  /**
   * Create a new user
   */
  create({ name, email, password, age, gender, fitnessGoal }) {
    const newUser = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password, // stored as hashed value by controller
      age: age || null,
      gender: gender || null,
      fitnessGoal: fitnessGoal || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  /**
   * Update an existing user by ID
   */
  update(id, updates) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    // Merge updates, preserve immutable fields
    users[index] = {
      ...users[index],
      ...updates,
      id: users[index].id,         // cannot change ID
      email: users[index].email,   // cannot change email via update
      password: users[index].password,
      createdAt: users[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },

  /**
   * Delete a user by ID
   */
  delete(id) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

module.exports = UserModel;
