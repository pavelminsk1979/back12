import {Request} from "express";

export type RequestWithParams<P> = Request<P, unknown, unknown, unknown>