import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { clothesItem, clothesType } from "../../../utils/types";

// TODO:
// UPDATE LAST WORN DATE

export const POST: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (email === null) {
    return new Response("Missing Email", { status: 500 });
  }

  const todaysOutfit: clothesItem[] = []; // will hold today's outfit

  // grabbing data
  const formData = await request.formData();

  for (const entry of formData.entries()) {
    const item: clothesItem = {
      type: entry[0],
      photoLink: entry[1]?.toString(),
      fileRef: "",
    };
    todaysOutfit.push(item); // append item to the end of todaysOutfit
  }

  // grabing date
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  try {
    const db = getFirestore(app);

    // grabs ref to the clothes
    const docRef = await db
      .collection("users")
      .doc(email)
      .collection("outfits")
      .doc(`${year}`)
      .collection(`${month}`)
      .doc(`${day}`)
      .get();

    // if the document does not exist, create it
    if (!docRef.exists) {
      await db
        .collection("users")
        .doc(email)
        .collection("outfits")
        .doc(`${year}`)
        .collection(`${month}`)
        .doc(`${day}`)
        .set({
          outfit: todaysOutfit,
        });
    } else {
      // if the document does exist, update it
      await db
        .collection("users")
        .doc(email)
        .collection("outfits")
        .doc(`${year}`)
        .collection(`${month}`)
        .doc(`${day}`)
        .update({
          outfit: todaysOutfit,
        });
    }

    return redirect("/dashboard"); // going back to dashboard
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
