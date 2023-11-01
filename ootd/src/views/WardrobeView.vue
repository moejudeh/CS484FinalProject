<template>
  <main class="Wardrobe">
    <div class="title">
      <h1>WARDROBE</h1>
    </div>
    <div class="wardrobeLinks">
      |
      <!-- used to dynamically add all the lists -->
      <router-link
        v-for="clothType in clothTypes"
        :key="clothType.name"
        :to="clothType.link"
      >
        {{ clothType.name }} |
      </router-link>

      <!-- used to add new categories -->
      <router-link to="/wardrobe/add">Add</router-link>
    </div>
  </main>
</template>

<script>
import router from "@/router";
import { ref } from "vue";

export default {
  name: "WardrobeView",
  setup() {
    // going to change to be able to add your own cloth types/folders
    // these will be the default ones
    // TODO: if group already exists, don't add it
    // TODO: be able to add own groups
    const clothTypes = ref([
      { name: "Tops", link: "/wardrobe/tops" },
      { name: "Jackets", link: "/wardrobe/jackets" },
      { name: "Sweater", link: "/wardrobe/sweater" },
      { name: "Bottoms", link: "/wardrobe/bottoms" },
      { name: "Shoes", link: "/wardrobe/shoes" },
    ]);

    clothTypes.value.forEach((clothType) => {
      router.addRoute({
        path: clothType.link.toLowerCase(),
        name: clothType.name,
        component: () => import(`@/views/ClothesView.vue`),
        props: {
          type: clothType.name,
        },
      });
    });

    return {
      clothTypes,
    };
  },
};
</script>
