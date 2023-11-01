<template>
  <div class="login">
    <h1>Login</h1>
    <form class="loginForm" @submit.prevent="login">
      <input
        type="email"
        placeholder="Enter Email"
        v-model="login_form.email"
      />
      <input
        type="password"
        placeholder="Enter Password"
        v-model="login_form.password"
      />
      <input type="submit" value="Login" />
    </form>
  </div>

  <div class="register">
    <h1>Register</h1>
    <form class="registerForm" @submit.prevent="register">
      <input
        type="email"
        placeholder="Enter Email"
        v-model="register_form.email"
      />
      <input
        type="password"
        placeholder="Enter Password"
        v-model="register_form.password"
      />
      <input type="submit" value="Register" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const login_form = ref({});
    const register_form = ref({});
    const store = useStore();

    const login = () => {
      store.dispatch("login", login_form.value);
    };

    const register = () => {
      store.dispatch("register", register_form.value);
    };

    return {
      login_form,
      register_form,
      login,
      register,
    };
  },
};

// TODO:
// WHEN WANTING TO ADD USERNAME TO LOGIN/REGISTER FORM USE DISPLAYNAME FROM FIREBASE
</script>

<style></style>
