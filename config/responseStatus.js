/*
200 OK: Successful request.
400 Bad Request: Invalid argument (invalid request payload).
403 Forbidden: Permission denied (e.g. invalid API key).
429 Resource Exhausted: Either out of resource quota or reaching rate limiting.
500 Internal Server Error: Internal server error (retry your request).
503 Service Unavailable: Unavailable.
504 Gateway Timeout: Deadline exceeded (retry your request).
*/

export const RESPONSE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
