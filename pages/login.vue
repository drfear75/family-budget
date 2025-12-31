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
      console.log('SignUp Data:', data)
      if (data.user && !data.session) {
          message.value = 'Registration successful! Please check your email to confirm your account.'
      } else if (data.session) {
          message.value = 'Registration successful! You are logged in.'
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
    }
  } catch (error: any) {
    console.error('Auth Error:', error)
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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Family Budget</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to manage your expenses</p>
      </div>

      <div v-if="message" class="p-4 rounded-md" :class="message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'">
        {{ message }}
      </div>

      <div class="mt-8 space-y-6">
        <div class="space-y-4">
             <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <div class="mt-1">
                  <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="mt-1">
                  <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
              </div>
              
              <button @click="handleAuth" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {{ loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In') }}
              </button>
              
               <div class="text-center">
                <button @click="isSignUp = !isSignUp" class="text-sm text-blue-600 hover:text-blue-500">
                  {{ isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up' }}
                </button>
              </div>
        </div>
      
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="space-y-4">
          <button @click="login('google')" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
            Sign in with Google
          </button>
          <button @click="login('azure')" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
