const pool = require("../db");
const jwt = require("jsonwebtoken");

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

    // Vérification directe email + password
    const result = await pool.query(
      `
      SELECT * 
      FROM users
      WHERE LOWER(email) = LOWER($1)
        AND password = crypt($2, password)
      `,
      [email, password],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "SECRET_KEY",
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user.id_user,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // 👈 IMPORTANT
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// REGISTER
// =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier si email existe déjà
    const emailCheck = await pool.query(
      "SELECT id_user FROM users WHERE LOWER(email) = LOWER($1)",
      [email],
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    // Insertion avec hash pgcrypto
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, crypt($3, gen_salt('bf')), $4)
       RETURNING id_user, name, email, role`,
      [name, email, password, role],
    );

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// GET ALL USERS
// =======================
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_user, name, email, role FROM users ORDER BY id_user ASC",
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// GET ONE USER
// =======================
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id_user, name, email, role FROM users WHERE id_user = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// UPDATE USER
// =======================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           role = COALESCE($3, role)
       WHERE id_user = $4
       RETURNING id_user, name, email, role`,
      [name, email, role, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// DELETE USER
// =======================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id_user = $1 RETURNING id_user",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec ses events et inscriptions",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
