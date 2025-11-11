import express from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import { validateAppointment } from '../middleware/validateAppointment.js';

const router = express.Router();

// @route POST /api/appointments
// @desc Create a new appointment
router.post('/', validateAppointment, async (req, res) => {
    try {
        const { patientName, email, phone, date, doctor, notes } = req.body;

        if (!date) {
            return res.status(400).json({ message: "Date is required"})
        }

        //Normalize date
        const appointmentDate = new Date(date);
        appointmentDate.setSeconds(0, 0); //Normalize seconds/milliseconds

        //Check is slot already taken
        const existing = await Appointment.findOne({ date: appointmentDate});
        if (existing) {
            return res.status(400).json({ message: "El horario ya está reservado" });
        }
        
        const appointment = new Appointment({ patientName, email, phone, date: appointmentDate, doctor, notes });
        await appointment.save();

        res.status(201).json({ message: 'Appointment created successfully', appointment });
        } catch (error) {
            console.error('Error creating appointment:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

// @route GET /api/appointments
// @desc Get all appointments (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { doctor, status, from, to }= req.query;

        //Build dynamic query object
        const query = {};

        if (doctor) query.doctor = doctor;
        if (status) query.status = status;
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }

        const appointments = await Appointment.find().sort({ date: 1});
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error"});
    }

});

// GET /api/appointments/availability?date=YYYY-MM-DD //Check this.
router.get("/availability", async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({message: "date is required"});

        //Define working hours

        const startHour = 9;
        const endHour = 17;
        const intervalMinutes = 30;

        //Generate all possible slots for the day
        const slots = [];
        let current = new Date(date);
        current.setHours(startHour, 0, 0, 0);

        while (current.getHours() < endHour) {
            slots.push(new Date(current).toISOString());
            current = new Date(current.getTime()+ intervalMinutes * 60 * 1000)
        }

        // Get booked appointments for taht day
        const startofDay = new Date(date);
        startofDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            date: { $gte: startofDay, $lte: endOfDay},
        });

        const bookedSlots = appointments.map(a =>{
            const d = new Date(a.date);
            d.setSeconds(0, 0); // normalize
            return d.toISOString()
        });

        console.log("checking availability fot:", date);
        console.log("All generated slots:", slots);
        console.log("Booked slots", bookedSlots);

        //Filter out booked slots
        const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

        console.log("Available slots", availableSlots);
        console.log("────────────────────────────")

        res.json({ availableSlots, bookedSlots });
    } catch (err) {
        console.error("Error fetching availability", err);
        next(err);
    }
});

// @route GET /api/appointments/:id
// @desc Get appointment by ID
router.get('/:id', async (req, res, next) => {
    try {

        const { id } = req.params;
        // check if id is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            return next(new Error("Invalid appointment ID"));
        }

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            res.status(404);
            return next(new Error("Appointment not found"));
        }

        res.json(appointment);
    } catch (error) {
        next(error);
    }
});

//@route PUT /api/appointments/:id
//@desc Update appointment by ID
router.put('/:id', validateAppointment, async (req, res) => {
    try{
        const { patientName, email, phone, date, doctor, notes } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { patientName, email, phone, date, doctor, notes },
            { new: true, runValidators: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route DELETE /api/appointments/:id
// @desc Delete appointment
router.delete('/:id', async (req, res) => {
    try{
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if(!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    }catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//@route PATCH /api/appointments/:id/status
//@desc Update only the appointment status

router.patch('/:id/status', async (req, res) => {
    try {
        const {status} =req.body;
        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value"});
        }
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found"});
        }

        res.json({ message: "Status updated succesfully", appointment});

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Server error"});
    }
});

export default router;