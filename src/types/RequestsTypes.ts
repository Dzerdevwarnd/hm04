import { Request } from 'express'

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
export type RequestParamsQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithCookies<C> = Request<{}, {}, {}, C>
export type RequestWithParamsAndCookies<P, C> = Request<P, {}, {}, C>
