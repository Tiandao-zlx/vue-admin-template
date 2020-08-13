import { get } from "./request"

export const getRightsList = (type) => get(`/rights/${type}`)