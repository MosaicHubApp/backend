export interface UserRequest extends Express.Request {
    user: { userId: number; }
}