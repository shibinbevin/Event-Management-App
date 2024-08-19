import express from "express";
import { connection } from "../server/database";
import Joi from "joi";
import Venue from "../models/venue";
import Event from "../models/event";

const router = express.Router();

const venueSchema = Joi.object().keys({
    venue_name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    capacity: Joi.number().required(),
    is_available: Joi.bool().required()
});

router.post('/add', async (req, res) => {
    const result = venueSchema.validate(req.body);
    if (result.error) {
        res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
        return;
    }
    const { venue_name, country, city, capacity, is_available } = req.body;
    try {
        const venueRepository = connection!.getRepository(Venue);

        const v = new Venue();
        v.venue_name = venue_name;
        v.country = country;
        v.city = city;
        v.capacity = capacity;
        v.is_available = is_available;

        const venue = await venueRepository.save(v)
        res.status(201).json(venue)

    } catch (error) {
        res.status(500).json({ msg: "Error", error })
    }
});

router.put('/edit/:id', async (req, res) => {

    const result = venueSchema.validate(req.body);
    if (result.error) {
        res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
        return;
    }

    const { venue_name, country, city, capacity, is_available } = req.body;
    const venue_id = req.params.id;

    try {
        const venueRepository = connection!.getRepository(Venue);

        const venue = await venueRepository.findOne(venue_id);
        if (!venue) {
            res.status(404).json({ success: false, msg: "Venue not found" });
            return;
        }

        venue.venue_name = venue_name;
        venue.country = country;
        venue.city = city;
        venue.capacity = capacity;
        venue.is_available = is_available;
        const updatedVenue = await venueRepository.save(venue);
        res.status(200).json(updatedVenue);

    } catch (error) {
        res.status(500).json({ msg: "Error", error });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const venue_id = req.params.id;

    try {
        const venueRepository = connection!.getRepository(Venue);
        const eventRepository = connection!.getRepository(Event);

        const venue = await venueRepository.findOne(venue_id);
        if (!venue) {
            res.status(404).json({ success: false, msg: "Venue not found" });
            return;
        }

        const eventCount = await eventRepository.count({ where: { venue } });
        if (eventCount > 0) {
            res.status(400).json({ success: false, msg: "Cannot delete venue with associated events" });
            return;
        }

        await venueRepository.remove(venue);
        res.status(200).json({ success: true, msg: "Venue deleted successfully" });

    } catch (error) {
        res.status(500).json({ msg: "Error", error });
    }
});

router.get('/', (_req, res) => {
    const venueRepository = connection!.getRepository(Venue);

    venueRepository.find().then((venue) => {
        res.json(venue);
    }).catch((err) => {
        console.error('Error fetching venue:', err);
        res.status(500).json({ error: 'Error fetching venue data' });
    });
});

export default router;
