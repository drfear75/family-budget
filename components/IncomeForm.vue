<script setup lang="ts">
const amount = ref('')
const source = ref('Salary')
const date = ref(new Date().toISOString().split('T')[0])
const description = ref('')
const paidBy = ref('Massimo')
const loading = ref(false)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const emit = defineEmits(['income-saved'])

const sources = ['Salary', 'Freelance', 'Gift', 'Investment', 'Other']
const people = ['Massimo', 'Elena']

const submitIncome = async () => {
    // 1. Basic Check
    if (!user.value) {
        alert('Please login first')
        return
    }
    
    if (!amount.value || isNaN(parseFloat(amount.value))) {
        alert('Please enter a valid amount')
        return
    }

    // 2. Fetch Fresh User (Bypass potential Ref issues)
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !currentUser || !currentUser.id) {
        console.error('Auth Error:', authError)
        alert('Internal Error: Unable to retrieve your User ID. Please sign out and sign in again.')
        return
    }

    // 3. Construct Payload
    const payload = {
        user_id: currentUser.id,
        amount: parseFloat(amount.value),
        source: source.value,
        date: date.value,
        description: description.value,
        paid_by: paidBy.value
    }

    console.log('Income Payload:', payload)

    // 4. Insert
    const { error } = await supabase.from('incomes').insert(payload)

    if (error) {
        console.error('Supabase Insert Error:', error)
        alert('Error saving income: ' + error.message)
    } else {
        alert('Income saved!')
        emit('income-saved')
        amount.value = ''
        description.value = ''
    }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    <h3 class="text-xl font-semibold mb-4 text-green-700">New Income</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <input v-model="amount" type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" placeholder="0.00" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Source</label>
        <select v-model="source" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border">
            <option v-for="src in sources" :key="src" :value="src">{{ src }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Received By</label>
        <select v-model="paidBy" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border">
            <option v-for="person in people" :key="person" :value="person">{{ person }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Date</label>
        <input v-model="date" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" />
      </div>
      
       <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <input v-model="description" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" />
      </div>

      <button @click="submitIncome" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Save Income
      </button>
    </div>
  </div>
</template>
