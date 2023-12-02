import type { clothesItem } from "../../../utils/types";
import type { APIRoute } from "astro";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { pipeline } from "stream";
import { promisify } from "util";
import { Readable } from "stream";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  // getting image from formdata
  const formData = await request.formData();
  const image = formData.get("image");
  const type = formData.get("type");
  const typeString = type?.toString();

  // checking if there is an image and type
  if (!image || !(image instanceof File)) {
    return new Response("Missing Image", { status: 400 });
  }
  if (typeString === undefined) {
    return new Response("Missing Type", { status: 400 });
  }
  if (email === null) {
    return new Response("Missing Email", { status: 400 });
  }

  // preparing image for upload
  const imageBuffer = await image.arrayBuffer();
  const asyncPipeline = promisify(pipeline);

  try {
    // getting the file reference
    const storageRef = getStorage(app);
    const bucketRef = storageRef.bucket(
      import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET
    );
    const fileLoc = `${email}/${type}/${Date.now()}${image.name}`;
    const fileRef = bucketRef.file(fileLoc);

    // uploading the image to the storage
    const fileStream = fileRef.createWriteStream();
    const readableImageStream = new Readable();
    readableImageStream.push(Buffer.from(imageBuffer));
    readableImageStream.push(null);
    await asyncPipeline(readableImageStream, fileStream);

    // creating a clothing item
    const [downloadUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: new Date("9999-12-31"), // Set to a far future date so it never expires
    });

    const clothingItem: clothesItem = {
      type: typeString,
      photoLink: downloadUrl,
      fileRef: `${fileLoc}`,
    };

    // adding the item to the database
    const db = getFirestore(app);
    const docRef = db
      .collection("users")
      .doc(email)
      .collection("clothes")
      .doc(typeString);
    const doc = await docRef.get();

    if (doc.exists) {
      // if the type already exists, update the items
      const previewsItems = doc.data()?.items;
      const newItems = [...previewsItems, clothingItem];

      await docRef.set({ items: newItems }, { merge: true });
    } else {
      await docRef.set({ items: [clothingItem] });
    }

    return redirect("/dashboard"); // going back to dashboard
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
};
