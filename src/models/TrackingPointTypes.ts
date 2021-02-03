import { Document, Model, model, Schema } from 'mongoose';

/* ITrackingPointTypes interface for typescript. */
export interface ITrackingPointTypes extends Document {
    userId: string;
    tpName: string;
    description: string;
}

/* Mongoose schema. */
const trackingPointTypesSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    tpName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const TrackingPointTypes: Model<ITrackingPointTypes> = model('TrackingPointTypes', trackingPointTypesSchema);
export default TrackingPointTypes;