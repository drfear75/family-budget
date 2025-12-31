<script setup lang="ts">
const title = ref('')
const amount = ref('')
const dueDate = ref('')
const loading = ref(false)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const emit = defineEmits(['reminder-saved'])

const submitReminder = async () => {
    if (!user.value) {
        alert('Please login first')
        return
    }

    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !currentUser || !currentUser.id) {
        console.error('Auth Error:', authError)
        alert('Internal Error: Unable to retrieve your User ID. Please sign out and sign in again.')
        return
    }

    loading.value = true
  
    const payload = {
        user_id: currentUser.id,
        title: title.value,
        amount: amount.value ? parseFloat(amount.value) : null,
        due_date: dueDate.value,
        is_paid: false
    }

    console.log('Reminder Payload:', payload)

    const { error } = await supabase.from('reminders').insert(payload)

    loading.value = false
    
    if (error) {
        alert('Error creating reminder: ' + error.message)
        console.error('Supabase Error:', error)
    } else {
        emit('reminder-saved')
        title.value = ''
        amount.value = ''
        dueDate.value = ''
        alert('Reminder set!')
    }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-800">Set Reminder</h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="title" type="text" placeholder="e.g., Electricity Bill" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Amount (Optional)</label>
        <input v-model="amount" type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Due Date</label>
        <input v-model="dueDate" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>
      <button @click="submitReminder" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {{ loading ? 'Saving...' : 'Set Reminder' }}
      </button>
    </div>
  </div>
</template>
