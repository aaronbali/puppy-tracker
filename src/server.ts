import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { PuppyEvent, IPuppyEvent } from './models/PuppyEvent';

interface PuppyEventBody extends Omit<IPuppyEvent, 'timestamp'> {
  timestamp: string; // Frontend sends ISO string
}

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/puppy-tracker';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => console.error('MongoDB connection error:', error));

// Routes
// Get all events
app.get('/api/events', async (_req: Request, res: Response) => {
  try {
    const events = await PuppyEvent.find().sort({ timestamp: -1 });
    res.json(events);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error fetching events', error: message });
  }
});

// Add a new event
app.post('/api/events', async (req: Request, res: Response) => {
  try {
    const body = req.body as PuppyEventBody;
    const newEvent = new PuppyEvent({
      type: body.type,
      timestamp: body.timestamp,
      id: body.id
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error creating event', error: message });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const deletedEvent = await PuppyEvent.findOneAndDelete({ 
      id: parseInt(req.params.id) 
    });
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(deletedEvent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error deleting event', error: message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
