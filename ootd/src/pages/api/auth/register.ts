import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);
  // getData from form
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // check if fields are filled
  if (!name || !email || !password) {
    return new Response("Missing Required Fields", { status: 400 }); // return 400 if field empty
  }
  /* Create user */
  try {
    // creates user from form
    await auth.createUser({
      displayName: name,
      email: email,
      password: password,
    });


    // adding default clothes types when registering user
    const clothesTypes = ["Tops", "Bottoms", "Shoes", "Accessories"];
    const db = getFirestore(app);
    const userRef = db.collection("users").doc(email);
    const clothesRef = userRef.collection("clothes");
    clothesTypes.forEach(async (type) => {
      await clothesRef.doc(type).set({ items: [] });
    });


  } catch (error) {
    console.log(error);
    return new Response(`Something went wrong`, {
      status: 400,
    });
  }

  // if succesfull redirect to signin
  return redirect("/signin");
};