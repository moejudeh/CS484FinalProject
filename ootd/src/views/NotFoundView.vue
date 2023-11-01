<template>
  <div>
    <h1>Page not found</h1>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
  mounted() {
    // Redirect to homepage
    this.$router.push("/");
  },
};
</script>
