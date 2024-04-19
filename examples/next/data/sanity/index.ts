import {
  PAGE_EVALUATION_QUERYResult,
  PAGE_EXPERIMENT_QUERYResult,
  PAGE_QUERYResult,
} from "@/types/sanity.generated";
import {loadQuery} from "./loadQuery";
import {
  PAGE_EVALUATION_QUERY,
  PAGE_EXPERIMENT_QUERY,
  PAGE_QUERY,
} from "./queries";

export async function loadPage(pathname: string) {
  return loadQuery<PAGE_QUERYResult>({
    params: {pathname},
    query: PAGE_QUERY,
  });
}

export async function loadPageExperiment(pathname: string) {
  return loadQuery<PAGE_EXPERIMENT_QUERYResult>({
    query: PAGE_EXPERIMENT_QUERY,
    params: {pathname},
  });
}

export async function loadEvaluationPage({
  key,
  variant,
}: {
  key: string;
  variant: string;
}) {
  return loadQuery<PAGE_EVALUATION_QUERYResult>({
    query: PAGE_EVALUATION_QUERY,
    params: {experimentKey: key, experimentVariant: variant},
  });
}
