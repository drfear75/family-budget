<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const loading = ref(false)
const isSignUp = ref(false)
const message = ref('')

const handleAuth = async () => {
  loading.value = true
  message.value = ''
  try {
    if (isSignUp.value) {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      if (data.user && !data.session) {
          message.value = 'Registration successful! Please check your email.'
      } else if (data.session) {
          message.value = 'Registration successful!'
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
    }
  } catch (error: any) {
    message.value = 'Error: ' + error.message
  } finally {
    loading.value = false
  }
}

const login = async (provider: 'google' | 'azure') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) console.error(error)
}

watchEffect(() => {
  if (user.value) {
    return navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center gradient-bg p-4 shadow-xl">
    <div class="max-w-md w-full glass-card p-10 rounded-3xl animate-slide-up">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100/50 mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Family Budget</h2>
        <p class="text-slate-500 mt-2 font-medium">Manage your wealth with style.</p>
      </div>

      <div v-if="message" class="p-4 rounded-2xl mb-6 text-sm font-bold" :class="message.includes('Error') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'">
        {{ message }}
      </div>

      <div class="space-y-4">
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input v-model="email" type="email" placeholder="you@example.com" class="input-field" />
          </div>

          <div class="pb-2">
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input v-model="password" type="password" placeholder="" class="input-field" />
          </div>
          
          <button @click="handleAuth" :disabled="loading" class="btn-primary w-full py-4 shadow-lg shadow-indigo-100 animate-pulse-slow">
            {{ loading ? 'Securing...' : (isSignUp ? 'Create Account' : 'Sign In') }}
          </button>
          
          <div class="text-center">
            <button @click="isSignUp = !isSignUp" class="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
              {{ isSignUp ? 'Back to sign in' : 'New here? Join free' }}
            </button>
          </div>

          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
            <div class="relative flex justify-center text-xs font-bold uppercase tracking-widest text-slate-400"><span class="px-3 bg-white/80">Social Login</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button @click="login('google')" class="btn-secondary py-3 flex items-center justify-center gap-2 hover:border-indigo-200 hover:bg-white">
              <span class="sr-only">Google</span>
              <span class="text-xs font-black uppercase">Google</span>
            </button>
            <button @click="login('azure')" class="btn-secondary py-3 flex items-center justify-center gap-2 hover:border-indigo-200 hover:bg-white">
              <span class="sr-only">Microsoft</span>
              <span class="text-xs font-black uppercase">Microsoft</span>
            </button>
          </div>
      </div>
    </div>
  </div>
</template>
