"use client";

import {useEffect} from "react";
import {useCookie} from "react-use";
import * as amplitude from "@amplitude/analytics-browser";
import {sessionCookieName} from "@/utils/amplitude";

export function AmplitudeSdk() {
  const [amplitudeCookie] = useCookie(sessionCookieName);

  useEffect(() => {
    const deviceId = decodeDeviceId(amplitudeCookie);

    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || "", {
      defaultTracking: true,
      deviceId,
    });
  });

  return null;
}

function decodeDeviceId(cookieValue?: string | null) {
  if (!cookieValue) {
    return undefined;
  }

  const decodedCookieValue = atob(cookieValue);
  const decodedData = decodeURIComponent(decodedCookieValue);

  return JSON.parse(decodedData).deviceId;
}
