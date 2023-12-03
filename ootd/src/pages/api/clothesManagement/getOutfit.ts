import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { clothesItem } from "../../../closet/src/utils/types";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const day = url.searchParams.get("day");

  if (year === undefined || month === undefined || day === undefined) {
    return new Response("Invalid Date Value", { status: 500 });
  }

  if (email === null) {
    return new Response("Missing Email", { status: 500 });
  }

  try {
    const emptyOutfit: clothesItem[] = [];

    const db = getFirestore(app);
    const docRef = await db
      .collection("users")
      .doc(email)
      .collection("outfits")
      .doc(`${year}`)
      .collection(`${month}`)
      .doc(`${day}`)
      .get();

    if (!docRef.exists) {
      return new Response(JSON.stringify(emptyOutfit), { status: 200 });
    }

    const outfitData = docRef.data();
    if (outfitData === undefined) {
      return new Response(JSON.stringify(emptyOutfit), { status: 200 });
    }

    return new Response(JSON.stringify(outfitData), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
