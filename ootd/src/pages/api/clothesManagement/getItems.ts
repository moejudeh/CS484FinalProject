import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { clothesItem, clothesType } from "../../../closet/src/utils/types";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (email === null) {
    return new Response("Missing Email", { status: 500 });
  }

  try {
    const db = getFirestore(app);
    const docRef = await db
      .collection("users")
      .doc(email)
      .collection("clothes")
      .get();

    const typeGroups: clothesType[] = docRef.docs.map((doc) => {
      const data = doc.data();
      const type = doc.id;

      const clothesItems: clothesItem[] = data.items.map(
        (item: clothesItem) => {
          return {
            type: item.type,
            photoLink: item.photoLink,
          };
        }
      );
      return {
        type: type,
        clothesItems: clothesItems,
      };
    });

    return new Response(JSON.stringify(typeGroups), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
