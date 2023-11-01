import { createStore } from "vuex";
import router from "../router";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword, // used to create user
  signInWithEmailAndPassword, // used to sign in user
  signOut, // used to signout
} from "firebase/auth";

export default createStore({
  state: {
    user: null, // to know which user is logged in
  },
  getters: {},
  mutations: {
    // used to log in user
    SET_USER(state, user) {
      state.user = user;
    },

    // used to log out user
    CLEAR_USER(state) {
      state.user = null;
    },
  },
  actions: {
    // used to login user
    async login({ commit }, data) {
      const { email, password } = data; // gets data from form
      try {
        // tries to login user
        await signInWithEmailAndPassword(auth, email, password);
        console.log(auth.currentUser);
      } catch (error) {
        console.log("Something Went Wrong");
        console.log(error.code);
        return;
      }

      // if no error then setting user to the logged in user
      // and reroute to dashboard
      commit("SET_USER", auth.currentUser);
      router.push("/");
    },

    // used to register user
    async register({ commit }, data) {
      const { email, password } = data; // gets data from form
      try {
        // tries to create user
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log("Something Went Wrong");
        console.log(error.code);
        return;
      }

      // if no error then setting user to the registered user
      // and reroute to dashboard
      commit("SET_USER", auth.currentUser);
      router.push("/");
    },

    // used to logout user and reroute to login page
    async logout({ commit }) {
      await signOut(auth);
      commit("CLEAR_USER");
      router.push("/login");
    },

    // used to get user on startup
    fetchUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          commit("CLEAR_USER");
        } else {
          commit("SET_USER", user);

          // if user is logged in then go to dashboard
          if (router.isReady() && router.currentRoute.value.path === "/login") {
            router.push("/");
          }
        }
      });
    },
  },
  modules: {},
});
