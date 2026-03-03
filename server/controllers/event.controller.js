const pool = require("../db");
// =======================
// GET all
// =======================
exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id_event,
        e.title,
        e.description,
        e.date,
        e.location,
        e.totalSeats,
        u.name AS organizer,
        COUNT(es.id_user) AS registered,
        (e.totalSeats - COUNT(es.id_user)) AS remaining_seats
      FROM events e
      JOIN users u ON e.createdBy = u.id_user
      LEFT JOIN events_submit es ON e.id_event = es.id_event
      GROUP BY e.id_event, u.name
      ORDER BY e.date ASC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// GET BY ID
// =======================
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        e.*,
        u.name AS organizer
      FROM events e
      JOIN users u ON e.createdBy = u.id_user
      WHERE e.id_event = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event non trouvé",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// CREATE
// =======================
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, totalSeats, createdBy } =
      req.body;

    if (!title || !date || !location || !totalSeats || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Champs requis manquants",
      });
    }

    // Vérifier que l'utilisateur existe
    const userCheck = await pool.query(
      "SELECT id_user FROM users WHERE id_user = $1",
      [createdBy],
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Organisateur non trouvé",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO events (title, description, date, location, totalSeats, createdBy)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [title, description, date, location, totalSeats, createdBy],
    );

    res.status(201).json({
      success: true,
      message: "Event créé avec succès",
      event: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// UPDATE
// =======================
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, totalSeats } = req.body;

    const result = await pool.query(
      `
      UPDATE events
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        date = COALESCE($3, date),
        location = COALESCE($4, location),
        totalSeats = COALESCE($5, totalSeats)
      WHERE id_event = $6
      RETURNING *
    `,
      [title, description, date, location, totalSeats, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event mis à jour",
      event: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// DELETE
// =======================
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM events WHERE id_event = $1 RETURNING id_event",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event supprimé avec ses inscriptions",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// =======================
// REGISTER TO EVENT
// =======================
exports.registerToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user } = req.body;

    if (!id_user) {
      return res.status(400).json({
        success: false,
        message: "id_user requis",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO events_submit (id_user, id_event)
      SELECT $1, $2
      WHERE (
        SELECT COUNT(*)
        FROM events_submit
        WHERE id_event = $2
      ) < (
        SELECT totalSeats
        FROM events
        WHERE id_event = $2
      )
      AND NOT EXISTS (
        SELECT 1
        FROM events_submit
        WHERE id_user = $1 AND id_event = $2
      )
      RETURNING *
    `,
      [id_user, id],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Event complet ou déjà inscrit",
      });
    }

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
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
// UNREGISTER TO EVENT
// =======================
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params; // id_event
    const { id_user } = req.body;

    const result = await pool.query(
      `
      DELETE FROM events_submit
      WHERE id_user = $1 AND id_event = $2
      RETURNING *
      `,
      [id_user, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inscription non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Désinscription réussie",
    });
  } catch (error) {
    console.error("UNREGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
