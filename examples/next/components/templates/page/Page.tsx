import {PAGE_QUERYResult} from "@/types/sanity.generated";

export function Page({data}: {data: PAGE_QUERYResult}) {
  return (
    <div className="container flex justify-center py-20">
      <h1>{data?.title}</h1>
    </div>
  );
}
