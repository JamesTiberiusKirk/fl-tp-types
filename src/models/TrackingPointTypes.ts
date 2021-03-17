import { Document, Model, model, Schema } from 'mongoose';

export enum DataType {
    Sets = 'sets',
    SingleValue = 'single-value',
}

/* ITrackingPointTypes interface for typescript. */
export interface ITrackingPointTypes extends Document {
    userId: string;
    tpName: string;
    description: string;
    dataType: DataType;
    measurementUnit: string;
}

/* Mongoose schema. */
const trackingPointTypesSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    tpName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    dataType: {
        type: DataType,
        required: true
    },
    measurementUnit: {
        type: String,
        required: true
    }
});

const TrackingPointTypes: Model<ITrackingPointTypes> = model('tracking-point-types', trackingPointTypesSchema);
export default TrackingPointTypes;