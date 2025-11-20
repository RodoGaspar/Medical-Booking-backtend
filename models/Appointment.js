import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    doctor: {
        type: String,
        enum: ["Dr. Brahms", "Dra. Scheeling", "Dr. Sforza"],
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
},
    {timestamps: true}
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;