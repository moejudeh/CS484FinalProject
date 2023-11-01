<template>
  <div>
    <h1>WARDROBE - {{ type?.toUpperCase() }}</h1>
  </div>
  <div class="closet">
    <v-for :key="item.id" :item="item" in="items">
      <card>
        <img :src="item.image" :alt="item.name" />
        <h3>{{ item.name }}</h3>
      </card>
    </v-for>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { ref } from "vue";
import { auth } from "@/firebase";

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  async setup() {
    const user = auth.currentUser;
    const items = ref([]);

    //testing
    await doc(
      collection(doc(collection(db, "users"), user), "categories"),
      type?.toLowerCase()
    ).add({ image: "test", name: "test" });

    const querySnapshot = await doc(
      collection(doc(collection(db, "users"), user), "categories"),
      type?.toLowerCase()
    ).get();

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      items.value.push(doc.data());
    });

    return {
      items,
    };
  },
};
</script>
