import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminAuth from './routes/adminAuth.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //lets us parse JSON bodies


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical-center';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB conection error:', err));

app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminAuth);
    
app.get('/', (req, res) => {
    res.send('API is running...');
});


// global error handler
app.use(errorHandler);

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});
