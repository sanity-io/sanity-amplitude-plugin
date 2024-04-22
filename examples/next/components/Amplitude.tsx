"use client";

import {useEffect} from "react";
import {useCookie} from "react-use";
import * as amplitude from "@amplitude/analytics-browser";
import {Experiment} from "@amplitude/experiment-js-client";

import type {AmplitudeExperiment} from "@/types/sanity.generated";
import {sessionCookieName} from "@/utils/amplitude";

const DEPLOYMENT_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY;

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

export function AmplitudeExperiment({
  experiment,
}: {
  experiment: AmplitudeExperiment;
}) {
  function loadExperiment() {
    if (!experiment?.key) {
      return;
    }

    const EXPERIMENT = Experiment.initializeWithAmplitudeAnalytics(
      DEPLOYMENT_KEY || "",
      {
        automaticExposureTracking: false,
        exposureTrackingProvider: {
          track: () => {
            amplitude.track("$exposure", {
              flag_key: experiment.key,
              variant: experiment.variant,
              experiment_key: experiment.key,
            });
          },
        },
      },
    );

    EXPERIMENT.exposure(experiment.key);
  }

  useEffect(() => {
    loadExperiment();
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
