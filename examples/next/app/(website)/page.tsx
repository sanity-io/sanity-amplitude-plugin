import {AmplitudeExperiment} from "@/components/Amplitude";
import {Page} from "@/components/templates/page/Page";

import {loadPage} from "@/data/sanity";

export type DefaultRouteProps = {
  searchParams: {[key: string]: string | string[] | undefined};
};

export default async function IndexRoute() {
  const data = await loadPage("/");

  return (
    <>
      <Page data={data} />
      {data?.experiment && <AmplitudeExperiment experiment={data.experiment} />}
    </>
  );
}
