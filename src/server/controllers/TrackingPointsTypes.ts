import { Request, Response } from 'express';
import TrackingPointTypes, { ITrackingPointTypes } from '../../models/TrackingPointTypes';


export function GetTrackingPoints(req: Request, res: Response) {
    let logger = res.locals.logger;
    let newTrackingPointType: ITrackingPointTypes = new TrackingPointTypes({
        userId: req.body.user_id,
        tpName: req.body.tp_name,
        description: req.body.description
    });

    newTrackingPointType.save().then(() => {
        return res.send('Successfully added');
    }).catch((err)=>{
        return res.send(err);
    });

}