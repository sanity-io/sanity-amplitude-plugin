import {revalidatePath, revalidateTag} from "next/cache";
import {draftMode} from "next/headers";
import {VisualEditing} from "next-sanity";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <main>{children}</main>
      {draftMode().isEnabled && (
        <VisualEditing
          refresh={async (payload) => {
            "use server";
            if (!draftMode().isEnabled) {
              console.debug(
                "Skipped manual refresh because draft mode is not enabled",
              );
              return;
            }
            if (payload.source === "mutation") {
              if (payload.document.slug?.current) {
                const tag = `${payload.document._type}:${payload.document.slug.current}`;
                console.log("Revalidate slug", tag);
                await revalidateTag(tag);
              }
              console.log("Revalidate tag", payload.document._type);
              return revalidateTag(payload.document._type);
            }
            await revalidatePath("/", "layout");
          }}
        />
      )}
    </>
  );
}
