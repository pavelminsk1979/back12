import {Request} from "express";


export type RequestWithParamsWithBody<P,B> =Request<P, unknown, B, unknown>