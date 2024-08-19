import express from "express";
import Joi from "joi";
import { connection } from "../server/database";
import Event from "../models/event";
import User from "../models/user";
import Ticket from "../models/ticket";

const router = express.Router();
const ticketSchema = Joi.object().keys({
    ticket_count: Joi.number().required(),
    user_id: Joi.string().optional(),
    event_id: Joi.string().optional(),
});

router.post("/book", async (req, res) => {
    const result = ticketSchema.validate(req.body);
    if (result.error) {
        return res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
    }

    const { ticket_count, user_id, event_id } = req.body;

    try {
        const eventRepository = connection!.getRepository(Event);
        const userRepository = connection!.getRepository(User);

        const eventData = await eventRepository.findOne({
            where: { event_id },
        });

        const userData = await userRepository.findOne({
            where: { user_id },
        });

        if (!eventData) {
            return res.status(404).json({ msg: "Event not found" });
        }

        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (eventData.tickets_available < ticket_count) {
            return res.status(400).json({
                success: false,
                msg: "Not enough tickets available",
            });
        }

        // Decrement the tickets available
        eventData.tickets_available -= ticket_count;

        const ticket = new Ticket();
        ticket.ticket_count = ticket_count;
        ticket.event = eventData;
        ticket.user = userData;

        // Save the ticket and update the event's tickets_available in a transaction
        await connection!.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.save(ticket);
            await transactionalEntityManager.save(eventData);
        });

        res.status(201).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ msg: "Error", error });
    }
});

router.get("/", (_req, res) => {
    const TicketRepository = connection!.getRepository(Ticket);

    TicketRepository.find({ relations: ['event', 'user'] })
        .then((event) => {
            res.json(event); // Send all users as JSON response
        })
        .catch((err) => {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Error fetching users" });
        });
});

router.delete("/:id", (req, res) => {
    const TicketRepository = connection!.getRepository(Ticket);
    const ticket_id = req.params.id;
    TicketRepository.delete(ticket_id)
        .then((result) => {
            if (result.affected === 1) {
                res.json({ message: "Ticket deleted successfully" });
            } else {
                res.status(404).json({ error: "Ticket not found" });
            }
        })
        .catch((err) => {
            console.error("Error deleting location:", err);
            res.status(500).json({ error: "Error deleting location" });
        });
});

router.get("/user/:user_id", async (req, res) => {
    const TicketRepository = connection!.getRepository(Ticket);
    const UserRepository = connection!.getRepository(User);
    const user_id = req.params.user_id;

    try {
        const user = await UserRepository.findOne(user_id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const tickets = await TicketRepository.find({
            where: { user: user },
            relations: ['user', 'event', 'event.category', 'event.venue']
        });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ msg: "Tickets not found" });
        }
        res.json(tickets);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ msg: "Error fetching data", error });
    }
});

router.get("/event/:event_id", async (req, res) => {
    const TicketRepository = connection!.getRepository(Ticket);
    const EventRepository = connection!.getRepository(Event);
    const event_id = req.params.event_id;

    try {
        const event = await EventRepository.findOne(event_id);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        const tickets = await TicketRepository.find({
            where: { event },
            relations: ['user', 'event', 'event.category', 'event.venue']
        });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ msg: "Tickets not found" });
        }
        res.json(tickets);

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ msg: "Error fetching data", error });
    }
});

export default router;