import express, { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import { connection } from "../server/database";
import Joi from "joi";
import Event from "../models/event";
import Venue from "../models/venue";
import Ticket from "../models/ticket";
import { LessThan, Not } from "typeorm";

const path = require('path');

const uploadDir = 'uploads/'; // Directory to save uploaded files

const router = express.Router();

const storage: StorageEngine = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename
  }
});

const upload = multer({ storage: storage });

// Ensure the upload directory exists
import fs from 'fs';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}

const eventSchema = Joi.object().keys({
  event_id: Joi.string().optional(),
  event_name: Joi.string().required(),
  organizer_name: Joi.string().min(3).max(15).optional(),
  venue: Joi.string().required(),
  category: Joi.string().required(),
  event_date: Joi.date().required(),
  role: Joi.string().optional(),
  image: Joi.string().optional()
});

router.post('/add', upload.single('image'), async (req, res) => {
  // Validate the request body
  const result = eventSchema.validate(req.body);
  if (result.error) {
    return res.status(422).json({
      success: false,
      msg: `Validation error: ${result.error.details[0].message}`,
    });
  }

  const { event_name, event_date, venue, category, organizer_name, role } = req.body;

  const venueObj = JSON.parse(venue);
  const categoryObj = JSON.parse(category);

  let status: string | undefined;
  if (role === "admin") {
    status = "active";
  }

  try {
    const eventRepository = connection!.getRepository(Event);
    const venueRepository = connection!.getRepository(Venue);

    const venueRecord = await venueRepository.findOne({ where: { venue_id: venueObj.venue_id } });
    const eventRecord = await eventRepository.findOne({ where: { venue, event_date } });

    if (!venueRecord) {
      return res.status(404).json({ msg: "Venue not found" });
    }

    if (!venueRecord.is_available) {
      return res.status(400).json({ msg: "Venue is not available" });
    }

    if (eventRecord) {
      return res.status(400).json({ msg: "Venue is not available for this particular date" });
    }

    const event = new Event();
    event.event_name = event_name;
    event.event_date = event_date;
    event.organizer_name = organizer_name;
    event.tickets_available = venueRecord.capacity;
    event.venue = venueObj;
    event.category = categoryObj;
    event.status = status || 'pending';

    // Handle file upload
    if (req.file) {
      event.image = req.file.path; // Save the file path in the event record
    }

    await eventRepository.save(event);

    const newEvent = await eventRepository.findOne({ where: { event_id: event.event_id }, relations: ['category', 'venue'] });

    res.status(201).json({ success: true, newEvent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
  const event_id = req.params.id;

  const result = eventSchema.validate(req.body);

  if (result.error) {
    return res.status(422).json({
      success: false,
      msg: `Validation error: ${result.error.details[0].message}`,
    });
  }

  const { event_name, event_date, venue, category, organizer_name } = req.body;
  const venueObj = JSON.parse(venue);
  const categoryObj = JSON.parse(category);

  try {
    const eventRepository = connection!.getRepository(Event);
    const venueRepository = connection!.getRepository(Venue);
    const venueRecord = await venueRepository.findOne({ venue_id: venueObj.venue_id });

    if (!venueRecord) {
      return res.status(404).json({ msg: "Venue not found" });
    }

    if (!venueRecord.is_available) {
      return res.status(400).json({ msg: "Venue is not available" });
    }

    const eventRecord = await eventRepository.findOne({
      where: {
        venue: venueObj,
        event_date,
        event_id: Not(event_id), // Exclude the current event ID
      },
    });

    if (eventRecord) {
      return res.status(400).json({ msg: "Venue is not available for this particular date" });
    }

    const event = await eventRepository.findOne(event_id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    event.event_name = event_name;
    event.event_date = event_date;
    event.organizer_name = organizer_name;
    event.venue = venueObj; // Parse venue JSON string
    event.category = categoryObj; // Parse category JSON string

    if (req.file) {
      // If there is a new file, delete the old one
      if (event.image) {
        if (fs.existsSync(event.image)) {
          fs.unlinkSync(event.image); // Synchronously delete the old file
        }
      }
      event.image = req.file.path; // Save the new filename
    }

    await eventRepository.save(event);

    const newEvent = await eventRepository.findOne({
      where: { event_id },
      relations: ['category', 'venue']
    });

    res.status(200).json(newEvent);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const event_id = req.params.id;

  try {
    const eventRepository = connection!.getRepository(Event);
    const ticketRepository = connection!.getRepository(Ticket);
    const event = await eventRepository.findOne(event_id);

    const ticketCount = await ticketRepository.count({ where: { event } });
    if (ticketCount > 0) {
      res.status(400).json({ success: false, msg: "Tickets have been booked" });
      return;
    }

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Remove the image file if it exists
    if (event.image) {
      if (fs.existsSync(event.image)) {
        fs.unlinkSync(event.image); // Synchronously delete the file
      }
    }

    await eventRepository.remove(event);
    res.status(200).json({ msg: "Event deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
});

router.get('/', (_req, res) => {
  const EventRepository = connection!.getRepository(Event);

  EventRepository.find({ relations: ['venue', 'category'] }).then((events) => {
    res.json(events); // Send all events as JSON response
  }).catch((err) => {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Error fetching events' });
  });
});

router.get('/getevent/:event_id', (req, res) => {
  const event_id = req.params.event_id;
  const EventRepository = connection!.getRepository(Event);

  EventRepository.findOne({ where: { event_id: event_id }, relations: ['venue', 'category'] })
    .then((event) => {
      if (event) {
        res.json(event); // Send the specific event as JSON response
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    })
    .catch((err) => {
      console.error('Error fetching event:', err);
      res.status(500).json({ error: 'Error fetching event' });
    });
});

router.get('/stats', async (_req, res) => {
  try {
    const eventRepository = connection!.getRepository(Event);
    const ticketRepository = connection!.getRepository(Ticket);

    const totalEvents = await eventRepository.count();
    const totalBookings = await ticketRepository.count();
    const completedEvents = await eventRepository.count({ where: { event_date: LessThan(new Date()) } });

    res.status(200).json({
      success: true,
      totalEvents,
      completedEvents,
      totalBookings
    });
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    res.status(500).json({ error: 'Error fetching event statistics' });
  }
});

router.patch('/approve/:event_id', async (req, res) => {
  const { event_id } = req.params;

  try {
      const eventRepository = connection!.getRepository(Event);
      const event = await eventRepository.findOne(event_id);

      if (!event) {
          return res.status(404).json({ msg: 'Event not found' });
      }

      if (event.status !== 'pending') {
          return res.status(400).json({ msg: 'Event is not pending' });
      }

      event.status = 'active';
      await eventRepository.save(event);

      res.status(200).json(event);
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
  }
});

export default router;