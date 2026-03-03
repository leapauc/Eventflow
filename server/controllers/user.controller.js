// Base de données en mémoire
let users = [
  {
    id: 1,
    email: "admin@test.com",
    role: "admin",
    name: "Admin",
    password: "123456789",
  },
  {
    id: 2,
    email: "orga1@test.com",
    role: "organisateur",
    name: "Organisateur 1",
    password: "123456789",
  },
  {
    id: 3,
    email: "part1@test.com",
    role: "participant",
    name: "Participant 1",
    password: "123456789",
  },
  {
    id: 4,
    email: "orga2@test.com",
    role: "organisateur",
    name: "Organisateur 2",
    password: "123456789",
  },
  {
    id: 5,
    email: "part2@test.com",
    role: "participant",
    name: "Participant 2",
    password: "123456789",
  },
];

// =======================
// LOGIN
// =======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// REGISTER
// =======================
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Champs requis" });
  }

  const exists = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (exists) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: "participant", // 👈 rôle par défaut
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

// =======================
// GET ALL USER
// =======================
exports.getAllUsers = (req, res) => {
  res.json(users);
};

// =======================
// GET ONE USER
// =======================
exports.getUserById = (req, res) => {
  const { id } = req.params;

  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  res.json(user);
};

// =======================
// UPDATE USER
// =======================
exports.updateUser = (req, res) => {
  const { id } = req.params;

  const index = users.findIndex((u) => u.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  users[index] = {
    ...users[index],
    ...req.body,
  };

  res.json(users[index]);
};

// =======================
// DELETE USER
// =======================
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  users = users.filter((u) => u.id != id);

  res.json({ message: "Utilisateur supprimé" });
};
