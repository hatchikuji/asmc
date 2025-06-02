<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

let errorMessage = "";
let username = "";
let password = "";

const emit = defineEmits(['login-success', 'register-redirect']);

async function handleLogin() {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
      emit("login-success");
      await router.push('/')
    } else {
      errorMessage = data.message;
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
  }
}

function redirectRegister() {
  emit("register-redirect")
  router.push('/register')
}
</script>

<template>
  <div class="w-full h-screen bg-[#121212] flex flex-col items-center justify-center text-white px-4">
    <div class="w-full max-w-md bg-[#181818] p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-8">Connexion</h1>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
        <div class="relative">
          <input
              type="text"
              v-model="username"
              id="username"
              class="peer w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
              placeholder="Nom d'utilisateur"
              autocomplete="username"
              required
          />
        </div>

        <div class="relative">
          <input
              type="password"
              v-model="password"
              id="password"
              class="peer w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
              placeholder="Mot de passe"
              autocomplete="current-password"
              required
          />
        </div>
        <div class="flex justify-between items-center gap-5 mb-4">
          <button
              type="submit"
              class="bg-[#005A9C] w-full text-white font-semibold py-3 rounded transition  duration-200"
          >
            Connexion
          </button>
            <button
                type="button"
                class="bg-[#005A9C] w-full text-white font-semibold py-3 rounded transition duration-200"
                @click="redirectRegister"
            >
              S'inscrire
            </button>
        </div>
      </form>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>