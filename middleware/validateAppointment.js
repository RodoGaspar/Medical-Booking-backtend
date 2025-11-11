import { body, validationResult } from "express-validator";

export const validateAppointment = [
    body("patientName").isString().isLength({min: 2}).withMessage("Nombre inválido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("phone").isString().isLength({min: 6}).withMessage("Teléfono inválido"),
    body("date").isISO8601().withMessage("Fecha inválida"),
    body("doctor").isString().isLength({min: 2}).withMessage("Médico inválido"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }
        next();
    },
];