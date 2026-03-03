let events = [
  {
    id: 1,
    title: "Conférence VueJS",
    description: "Introduction à Vue 3",
    date: "2025-03-10",
    location: "Paris",
    totalSeats: 50,
    remainingSeats: 50,
    createdBy: "Admin",
  },
  {
    id: 2,
    title: "Workshop NodeJS",
    description: "API REST avec Express",
    date: "2025-04-01",
    location: "Lyon",
    totalSeats: 30,
    remainingSeats: 25,
    createdBy: "Organisateur 1",
  },
];

// GET all
exports.getAllEvents = (req, res) => {
  res.json(events);
};

// GET BY ID
exports.getEventById = (req, res) => {
  const { id } = req.params;

  const event = events.find((e) => e.id == id);

  if (!event) {
    return res.status(404).json({
      message: "Event non trouvé",
    });
  }

  res.json(event);
};

// CREATE
exports.createEvent = (req, res) => {
  const newEvent = {
    id: Date.now(),
    ...req.body,
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
};

// UPDATE
exports.updateEvent = (req, res) => {
  const { id } = req.params;

  const index = events.findIndex((e) => e.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Event non trouvé" });
  }

  events[index] = {
    ...events[index],
    ...req.body,
  };

  res.json(events[index]);
};

// DELETE
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  events = events.filter((e) => e.id != id);

  res.json({ message: "Event supprimé" });
};
