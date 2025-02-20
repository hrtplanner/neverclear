import { logger } from "../src";

export function applyLogger() {
    logger.extend({
        error: (...msg) => console.error("[NEVERCLEAR/ERR]", ...msg),
        warn: (...msg) => console.warn("[NEVERCLEAR/WARN]", ...msg),
        info: (...msg) => console.log("[NEVERCLEAR/INFO]", ...msg),
        debug: (...msg) => console.log("[NEVERCLEAR/DEBUG]", ...msg),
        log: (...msg) => console.log("[NEVERCLEAR/LOG]", ...msg),
    });
}