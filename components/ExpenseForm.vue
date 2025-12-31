<script setup lang="ts">
const amount = ref('')
const category = ref('Food')
const date = ref(new Date().toISOString().split('T')[0])
const description = ref('')
const paidBy = ref('Massimo')
const loading = ref(false)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const emit = defineEmits(['expense-saved'])

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other']
const people = ['Massimo', 'Elena']

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  loading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data, error } = await useFetch('/api/classify', {
      method: 'POST',
      body: formData
    })
    
    if (data.value) {
      amount.value = data.value.amount || ''
      category.value = data.value.category || 'Other'
      date.value = data.value.date || new Date().toISOString().split('T')[0]
      description.value = data.value.description || ''
    }
  } catch (e) {
    console.error('Classification failed', e)
  } finally {
    loading.value = false
  }
}

const submitExpense = async () => {
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
        console.error('Current User:', currentUser)
        alert('Internal Error: Unable to retrieve your User ID. Please sign out and sign in again.')
        return
    }

    // 3. Construct Payload
    const payload = {
        user_id: currentUser.id,
        amount: parseFloat(amount.value),
        category: category.value,
        date: date.value,
        description: description.value,
        paid_by: paidBy.value
    }

    console.log('Final Payload:', payload)

    // 4. Insert
    const { error } = await supabase.from('expenses').insert(payload)

    if (error) {
        console.error('Supabase Insert Error:', error)
        alert('Error saving expense: ' + error.message)
    } else {
        alert('Expense saved!')
        emit('expense-saved')
        amount.value = ''
        description.value = ''
    }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    <h3 class="text-xl font-semibold mb-4 text-gray-800">New Expense</h3>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Scan Receipt</label>
      <input type="file" @change="handleFileUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      <p v-if="loading" class="text-xs text-blue-500 mt-1">Analyzing receipt...</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <input v-model="amount" type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="0.00" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <select v-model="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Paid By</label>
        <select v-model="paidBy" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option v-for="person in people" :key="person" :value="person">{{ person }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Date</label>
        <input v-model="date" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>
      
       <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <input v-model="description" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
      </div>

      <button @click="submitExpense" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Save Expense
      </button>
    </div>
  </div>
</template>
