<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
let errorMessage = ref("");
let email = ref("");
let username = ref("");
let password = ref("");
let passwordConfirm = ref("");


const emit = defineEmits(["login-redirect"]);

async function handleRegister(){
  errorMessage.value = "";
  if(email.value === "" || username.value === "" || password.value === "" || passwordConfirm.value === ""){
    errorMessage.value = "Tous les champs sont obligatoires.";
    return;
  }
  if(password.value !== passwordConfirm.value){
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }
  try{
    const response = await fetch('/api/register',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        username:  username.value,
        password: password.value,
      }),
      credentials: 'include',
    });
    const data = await response.json();
    if(data.success){
      email.value = "";
      username.value = "";
      password.value = "";
      passwordConfirm.value = "";

      emit("login-redirect")
      await router.push('/login')
    } else {
      errorMessage.value = data.message;
    }
  } catch (error){
    console.error('Error during registration:', error);
    errorMessage.value = "Une erreur s'est produite lors de l'inscription.";
  }
}

function redirectLogin() {
  emit("login-redirect")
  router.push('/login')
}
</script>

<template>
  <div class="w-full h-screen bg-[#121212] flex flex-col items-center justify-center text-white px-4">
    <div class="w-full max-w-md bg-[#181818] p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-8">Inscription</h1>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-6">
        <div class="relative">
          <input
              type="email"
              v-model="email"
              id="email"
              class="peer w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
              placeholder="Email"
              autocomplete="current-email"
              required
          />
        </div>
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
              required
          />
        </div>
        <div class="relative">
          <input
              type="password"
              v-model="passwordConfirm"
              id="passwordConfirm"
              class="peer w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
              placeholder="Confirmer le mot de passe"
              required
          />
        </div>

        <div class="flex justify-between items-center gap-5 mb-4">
          <button
              type="submit"
              class="bg-[#005A9C] w-full text-white font-semibold py-3 rounded transition  duration-200"
          >
            S'inscrire
          </button>
          <button
              type="button"
              class="bg-[#005A9C] w-full text-white font-semibold py-3 rounded transition duration-200"
              @click="redirectLogin"
          >
            Connexion
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

