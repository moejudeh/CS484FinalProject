import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const GET: APIRoute = async ({ request }) => {
  const dateValue = request.headers.get("date-value");

  if (!dateValue) {
    return new Response("Missing Date Value", { status: 500 });
  }

  const [year, month, day] = dateValue?.split("-");

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
      .collection("outfits")
      .doc(`${year}`)
      .collection(`${month}`)
      .doc(`${day}`)
      .get();

    if (!docRef.exists) {
      return new Response("No Outfit", { status: 500 });
    }

    const outfitData = docRef.data();
    if (outfitData === undefined) {
      return new Response("No Outfit", { status: 500 });
    }

    return new Response(JSON.stringify(outfitData), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
