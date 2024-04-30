import {Request} from "express";

export type RequestWithQuery<Q> = Request<unknown, unknown, unknown, Q>