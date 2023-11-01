<template>
  <h1>PLACE HOLDER</h1>
  <h3>WILL HAVE WAY TO ADD CATEGORIES ONCE I GET FIREBASE WORKING</h3>

  <form @submit.prevent="addCategory">
    <input v-model="nameRef" type="text" placeholder="Enter Group Name" />
    <button type="submit">Add Group</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { db } from "@/firebase";

export default {
  name: "AddCategoryView",
  setup() {
    // used to get name from field
    const nameRef = ref("");
    const addCategory = () => {
      // create new category object
      const newCategory = {
        name: nameRef.value,
        link: "/wardrobe/" + nameRef.value.toLowerCase(),
      };
      db.collection("categories").add(newCategory);
      console.log(newCategory);
    };

    return {
      addCategory,
      nameRef,
    };
  },
};
</script>
