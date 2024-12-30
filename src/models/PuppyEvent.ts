import mongoose from 'mongoose';

export interface IPuppyEvent {
  type: 'pee' | 'poop' | 'water' | 'food';
  timestamp: Date;
  id: number;
}

const PuppyEventSchema = new mongoose.Schema<IPuppyEvent>({
  type: {
    type: String,
    enum: ['pee', 'poop', 'water', 'food'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  }
});

export const PuppyEvent = mongoose.model<IPuppyEvent>('PuppyEvent', PuppyEventSchema);
