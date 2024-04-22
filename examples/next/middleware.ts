import type {NextRequest} from "next/server";
import type {UserSession} from "@amplitude/analytics-types";
import {NextResponse} from "next/server";

import type {AmplitudeExperiment} from "./types/sanity.generated";
import {loadEvaluationPage, loadPageExperiment} from "./data/sanity";
import {getOrCreateUserSession, setHandoffCookie} from "./utils/amplitude";

export async function middleware(request: NextRequest) {
  const sanityPage = await loadPageExperiment(request.nextUrl.pathname);
  const experiment = sanityPage?.experiment;

  if (!experiment || !experiment.key) {
    // Return next() if page is not part of an experiment
    return NextResponse.next();
  }

  const {userSession, isNewUser} = getOrCreateUserSession(request);
  // Fetch Amplitude evaluation based on page experiment
  const evaluation = await fetchAmplitudeEvalutation({experiment, userSession});

  if (!evaluation || experiment.variant === evaluation?.[experiment.key].key) {
    const response = NextResponse.next();
    if (isNewUser) {
      setHandoffCookie(userSession, response, request);
    }
    // Return next() if page experiment is the same as Amplitude evaluation
    return response;
  }
  // Fetch treatment page
  const sanityTreatmentPage = await loadEvaluationPage({
    key: experiment.key,
    variant: evaluation[experiment.key].key,
  });

  const response = sanityTreatmentPage?.slug?.current
    ? // Rewrite to treatment page
      NextResponse.rewrite(
        new URL(sanityTreatmentPage?.slug.current, request.url),
      )
    : NextResponse.next();

  if (isNewUser) {
    setHandoffCookie(userSession, response, request);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

async function fetchAmplitudeEvalutation({
  experiment,
  userSession,
}: {
  experiment: AmplitudeExperiment;
  userSession: UserSession;
}) {
  const deploymentKey = process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY;
  const endpoint = new URL("https://api.lab.amplitude.com/v1/vardata");

  if (!experiment.key || !deploymentKey) {
    return null;
  }

  endpoint.searchParams.set("flag_key", experiment.key);
  endpoint.searchParams.set("device_id", userSession.deviceId ?? "");

  const result = await fetch(endpoint.href, {
    method: "GET",
    headers: {
      Authorization: `Api-Key ${deploymentKey}`,
    },
  });

  if (!result.ok) {
    console.error(result);
    return null;
  }

  const data = await result.json();

  return data;
}
