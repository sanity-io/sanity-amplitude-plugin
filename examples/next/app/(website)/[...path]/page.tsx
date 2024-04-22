import {Page} from "@/components/templates/page/Page";

import {notFound} from "next/navigation";

import type {DefaultRouteProps} from "../page";
import {loadPage} from "@/data/sanity";
import {AmplitudeExperiment} from "@/components/Amplitude";

export type DynamicRouteProps = {
  params: {path: string[]};
} & DefaultRouteProps;

export default async function DynamicRoute({params}: DynamicRouteProps) {
  const initialData = await loadPage(params.path.join("/"));

  if (!initialData) return notFound();

  return (
    <>
      <Page data={initialData} />
      {initialData?.experiment && (
        <AmplitudeExperiment experiment={initialData.experiment} />
      )}
    </>
  );
}
