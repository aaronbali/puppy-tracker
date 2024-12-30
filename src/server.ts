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
let isConnected = false;

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI format:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Successfully connected to MongoDB');
  } catch (error: any) {
    isConnected = false;
    console.error('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    // Don't throw error - let server start anyway
  }
};

// Initial connection
connectDB();

// Reconnection logic
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  isConnected = false;
  setTimeout(connectDB, 5000);
});

// Routes
// Get all events
app.get('/api/events', async (req: Request, res: Response) => {
  console.log('GET /api/events request received');
  
  if (!isConnected) {
    console.log('MongoDB not connected - returning empty array');
    return res.json([]);
  }

  try {
    console.log('Querying events from MongoDB...');
    const events = await PuppyEvent.find().sort({ timestamp: -1 });
    console.log(`Found ${events.length} events`);
    res.json(events);
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error fetching events', error: message });
  }
});

// Add a new event
app.post('/api/events', async (req: Request, res: Response) => {
  if (!isConnected) {
    return res.status(503).json({ message: 'Database connection not available' });
  }

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
    console.error('Error creating event:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error creating event', error: message });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req: Request, res: Response) => {
  if (!isConnected) {
    return res.status(503).json({ message: 'Database connection not available' });
  }

  try {
    const deletedEvent = await PuppyEvent.findOneAndDelete({ 
      id: parseInt(req.params.id) 
    });
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(deletedEvent);
  } catch (error: unknown) {
    console.error('Error deleting event:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error deleting event', error: message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
