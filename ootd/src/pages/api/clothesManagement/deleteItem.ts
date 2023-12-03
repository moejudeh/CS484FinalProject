import type { clothesItem } from "../../../closet/src/utils/types";
import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const email = data.email;
    const { type, photoLink } = data.clothesItem;

    if (email === undefined || type === undefined || photoLink === undefined) {
      return new Response("Missing Email, Type or PhotoLink", {
        status: 500,
      });
    }

    console.log(email, type, photoLink);

    const db = getFirestore(app);
    const docRef = db
      .collection("users")
      .doc(email)
      .collection("clothes")
      .doc(type);

    const doc = await docRef.get();

    // if it doesnt exist, return 404
    if (!doc.exists) {
      return new Response("No such document", { status: 404 });
    }

    // check if there is data in doc
    const databaseData = doc.data();
    if (databaseData === undefined) {
      return new Response("No such document", { status: 404 });
    }

    // grabs all the items from the database
    const items = databaseData.items;

    // grabs the fileRef for the storage database before deleting it
    const item = items.find(
      (item: clothesItem) => item.photoLink === photoLink
    );
    const fileLoc = item?.fileRef;

    console.log(fileLoc);

    if (fileLoc === undefined) {
      return new Response("No such file", { status: 404 });
    }

    // filter out the item with the same photoLink
    const newItems = items.filter(
      (item: clothesItem) => item.photoLink !== photoLink
    );

    // update the document with the new items
    await docRef.update({
      items: newItems,
    });

    return new Response("Item Deleted", { status: 200 });
  } catch (error) {
    // console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
