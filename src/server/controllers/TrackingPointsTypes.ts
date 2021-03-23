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

/**
 * GET express controller for "/" .
 * Can provide search queries and it will return an array of matches,
 *   based on the ID found in the jwt payload or the user id in case
 *   the request was done by another microservice with the appropriate
 *   JWT token.
 *
 * Possible queries (delivered by URL params.)
 *   - user_id: used for for internal uses
 *   - tp_id: tracking point id
 *   - tp_name: tracking point name
 *   - description: description for tracking point types.
 *
 * @param req
 * @param res
 */
export async function GetAllTrackingPoints(req: Request, res: Response) {
    const roles = res.locals.jwtPayload.roles;
    const query: { [k: string]: any } = {};

    // .find doesnt work
    roles[0] === 'microservice' ?
        query.userId = req.query.user_id :
        query.userId = res.locals.jwtPayload.id;

    if (req.query.tp_id) query._id = req.query.tp_id;
    if (req.query.tp_name) query.tpName = { $regex: req.query.tp_name };
    if (req.query.description) query.description = { $regex: req.query.description };

    const result = await TrackingPointTypes.find(query);
    return res.send(result);
}

/**
 * POST express controller for "/".
 * Adds a new tracking point type.
 *
 * Post body data:
 *   - tp_name: tracking point name
 *   - description: description for the tracking point
 *   - data_type: enum of the kind of data to be stored (options: "single-value", "sets")
 *   - measurement_unit: some unit of measurment
 * @param req
 * @param res
 */
export async function AddTrackingPointTypes(req: Request, res: Response) {
    const newTrackingPointType: ITrackingPointTypes = new TrackingPointTypes({
        userId: res.locals.jwtPayload.id,
        tpName: req.body.tpName,
        description: req.body.description,
        dataType: req.body.dataType,
        measurementUnit: req.body.measurementUnit,
    });

    try{
        await newTrackingPointType.save();
        return res.send(Responses.Added);
    } catch (err) {
        Logger.err(err);
        return res.send(err);
    }
}

/**
 * PUT express controller for "/".
 * Updates existing document.
 * Provide a body of data with the data wanted to be updated,
 *   of course provide the id.
 *
 * Put body optional data:
 *   - tp_name: tracking point name
 *   - description: description for the tracking point
 *   - data_type: enum of the kind of data to be stored (options: "single-value", "sets")
 *
 * @param req
 * @param res
 */
export async function UpdateTrackingPointTypes(req: Request, res: Response) {
    const filter: { [k: string]: any } = {};
    const update: { [k: string]: any } = {};

    const updateType = req.body;

    if (res.locals.jwtPayload.id) filter.userId = res.locals.jwtPayload.id;
    if (updateType.tpId) filter._id = updateType.tpId;
    // if (updateType.dataType) return res.status(400).send(Responses.CannotUpdateDataType);
    if (updateType.description) update.description = updateType.description;
    if (updateType.tpName) update.tpName = updateType.tpName;
    if (updateType.measurementUnit) update.measurmentUnit = updateType.measurementUnit;

    try {
        await TrackingPointTypes.findOneAndUpdate(filter, update);
        return res.send(Responses.Updated);
    } catch (err){
        Logger.err(err);
        return res.send(err);
    }
}

/**
 * DELETE express controller for "/".
 * Deletes a document based on the id provided in the body.
 *
 * Param data:
 *   - tp_id: id of the record to delete.
 * @param req
 * @param res
 */
export async function DeleteTrackingPointTypes(req: Request, res: Response) {
    const filter: { [k: string]: any } = {};
    if (res.locals.jwtPayload.id) filter.userId = res.locals.jwtPayload.id;
    if (req.query.tp_id) filter._id = req.query.tp_id;

    try {
        await TrackingPointTypes.findByIdAndDelete(filter);
        return res.send(Responses.Deleted);
    } catch (err){
        Logger.err(err);
        return res.status(500).send(err);
    }
}
