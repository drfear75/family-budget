<script setup lang="ts">
const title = ref('')
const amount = ref('')
const dueDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const emit = defineEmits(['reminder-saved'])

const submitReminder = async () => {
    if (!user.value) return
    if (!title.value) {
        alert('Please enter a title')
        return
    }

    loading.value = true
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('reminders').insert({
        user_id: currentUser.id,
        title: title.value,
        amount: amount.value ? parseFloat(amount.value) : null,
        due_date: dueDate.value,
        is_paid: false
    })

    loading.value = false
    if (error) {
        alert(error.message)
    } else {
        title.value = ''
        amount.value = ''
        emit('reminder-saved')
    }
}
</script>

<template>
  <div class="glass-card p-6 rounded-3xl mb-8">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-800">Set Reminder</h3>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Title</label>
        <input v-model="title" type="text" class="input-field" placeholder="Rent, Internet, etc." />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Amount (Optional)</label>
          <input v-model="amount" type="number" step="0.01" class="input-field" placeholder="0.00" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Due Date</label>
          <input v-model="dueDate" type="date" class="input-field" />
        </div>
      </div>

      <button @click="submitReminder" :disabled="loading" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-100 mt-2 disabled:bg-slate-300">
        {{ loading ? 'Adding...' : 'Add Reminder' }}
      </button>
    </div>
  </div>
</template>
