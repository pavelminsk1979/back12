import {Request} from "express";

export type RequestWithParamsWithQuery<P,Q> = Request<P, unknown, unknown, Q>