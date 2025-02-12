import type { ExtendedError } from "socket.io/dist/namespace";
import { DatabaseAdapter } from "../../types/database-adapter";
import type { TypedServerSocket } from "../../types/socket-protocol";
export declare const createSocketAuthMiddleware: (db: DatabaseAdapter) => (socket: TypedServerSocket, next: (err?: ExtendedError) => void) => Promise<void>;
