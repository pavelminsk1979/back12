import {Request} from "express";

export type RequestWithBody<B> = Request<unknown, unknown, B, unknown>