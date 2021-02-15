import { Request, Response } from 'express';
import * as Logger from '@jamestiberiuskirk/fl-shared/dist/lib/Logger';
import TrackingPointTypes, { ITrackingPointTypes } from '../../models/TrackingPointTypes';

enum Responses {
    Added = 'Added',
    Updated = 'Updated',
    Deleted = 'Deleted',
    MissingUserId = 'Missing User Id',
    CannotUpdateDataType = 'Cannot Update Tracking Point Data Type'
}

export async function GetAllTrackingPoints(req: Request, res: Response) {
    const roles = res.locals.jwtPayload.roles;
    const query: { [k: string]: any } = {};

    // .find doesnt work
    roles[0] === 'microservices' ?
        query.userId = req.body.user_id :
        query.userId = res.locals.jwtPayload.id;

    if (req.query.tp_id) query._id = req.query.tp_id;
    if (req.query.tp_name) query.tpName = { $regex: req.query.tp_name };
    if (req.query.description) query.description = { $regex: req.query.description };

    const result = await TrackingPointTypes.find(query);
    return res.send(result);
}

export function AddTrackingPointTypes(req: Request, res: Response) {
    const newTrackingPointType: ITrackingPointTypes = new TrackingPointTypes({
        userId: res.locals.jwtPayload.id,
        tpName: req.body.tp_name,
        description: req.body.description,
        dataType: req.body.data_type,
    });

    return newTrackingPointType.save().then(() => {
        return res.send(Responses.Added);
    }).catch((err) => {
        Logger.err(err);
        return res.send(err);
    });
}

export async function UpdateTrackingPointTypes(req: Request, res: Response) {
    const filter: { [k: string]: any } = {};
    const update: { [k: string]: any } = {};

    if (res.locals.jwtPayload.id) filter.userId = res.locals.jwtPayload.id;
    if (req.body.tp_id) filter._id = req.body.tp_id;
    if (req.body.data_type) return res.status(400).send(Responses.CannotUpdateDataType);
    if (req.body.description) update.description = req.body.description;
    if (req.body.tp_name) update.tpName = req.body.tp_name;

    const data = await TrackingPointTypes.findOneAndUpdate(filter, update);
    return res.send(Responses.Updated);
}

export function DeleteTrackingPointTypes(req: Request, res: Response) {
    const filter: { [k: string]: any } = {};
    if (res.locals.jwtPayload.id) filter.userId = res.locals.jwtPayload.id;
    if (req.body.tp_id) filter._id = req.body.tp_id;

    TrackingPointTypes.findByIdAndDelete(filter).then(() => {
        return res.send(Responses.Deleted);
    }).catch(err => {
        return res.status(500).send(err);
    });
}