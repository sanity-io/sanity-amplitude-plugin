import type {UserSession} from "@amplitude/analytics-types";
import type {NextRequest, NextResponse} from "next/server";

const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || "";

// The name of the cookie used to store the user session
export const sessionCookieName = `AMP_${apiKey.substring(0, 10)}`;

/**
 * Gets the user session from a cookie, or creates a new one if it doesn't exist
 * or if the deviceId is missing
 * @param {NextRequest} request
 */
export const getOrCreateUserSession = (
  request: NextRequest,
): {isNewUser: boolean; userSession: UserSession} => {
  const existingUserSession = getUserSession(request);
  const isNewUser = !existingUserSession?.deviceId;

  const userSession = isNewUser ? makeUserSession() : existingUserSession;

  return {isNewUser, userSession};
};

export const setHandoffCookie = (
  userSession: UserSession,
  response: NextResponse<unknown>,
  request: NextRequest,
): void => {
  response.cookies.set({
    name: sessionCookieName,
    value: encodeDeviceId(userSession.deviceId),
    secure: request.nextUrl.protocol === "https:",
    httpOnly: false,
    sameSite: "strict",
    expires: new Date(Date.now() + 5000),
  });
};

const encodeDeviceId = (deviceId?: string): string => {
  if (!deviceId) {
    return "";
  }

  return btoa(encodeURIComponent(JSON.stringify({deviceId})));
};

/**
 * Gets the user session from a cookie
 * @param {NextRequest} request
 * @returns {UserSession | undefined} UserSession
 */
const getUserSession = (request: NextRequest): UserSession | undefined => {
  const {value} = request.cookies.get(sessionCookieName) ?? {};
  if (value) {
    const decoding = Buffer.from(value, "base64").toString();

    return JSON.parse(decodeURIComponent(decoding)) as UserSession;
  }
};

/**
 * Creates a user session with a UUID as the deviceId
 * @returns {UserSession} UserSession
 */
const makeUserSession = (): UserSession => {
  return {
    deviceId: createUUID(),
  } as UserSession;
};

/**
 * Creates a UUID using crypto
 * @returns {string} UUID
 */
const createUUID = (): string => crypto.randomUUID();
