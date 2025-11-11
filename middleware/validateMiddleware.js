export const validateAppointment = (req, res, next) => {
    const { patientName, email, phone, date, doctor} = req.body;

    if (!patientName || !email || !phone || !date || !doctor) {
        res.status(400);
        return next(new Error("Please fill in all required fields"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        return next( new Error("Invalid email format"))
    }

    if (phone.lenght < 6) {
        res.status(400);
        return next(new Error("Phone number seems too short."))
    }

    next(); // All good, continue
};