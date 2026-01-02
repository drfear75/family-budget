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

const selectedFile = ref<File | null>(null)
const imagePreview = ref('')

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  
  loading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await useFetch('/api/classify', {
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

const uploadImage = async () => {
    if (!selectedFile.value) return null
    
    const fileExt = selectedFile.value.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `expenses/${user.value?.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, selectedFile.value)

    if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
    }

    const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

    return publicUrl
}

const submitExpense = async () => {
    if (!user.value) {
        alert('Please login first')
        return
    }
    
    if (!amount.value || isNaN(parseFloat(amount.value))) {
        alert('Please enter a valid amount')
        return
    }

    loading.value = true
    
    try {
        const uploadedUrl = await uploadImage()
        
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !currentUser) {
            alert('Authentication error')
            return
        }

        const payload = {
            user_id: currentUser.id,
            amount: parseFloat(amount.value),
            category: category.value,
            date: date.value,
            description: description.value,
            paid_by: paidBy.value,
            image_url: uploadedUrl
        }

        const { error } = await supabase.from('expenses').insert(payload)

        if (error) {
            alert('Error saving expense: ' + error.message)
        } else {
            alert('Expense saved!')
            emit('expense-saved')
            resetForm()
        }
    } catch (err) {
        console.error('Submission error:', err)
        alert('An error occurred during submission')
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    amount.value = ''
    description.value = ''
    selectedFile.value = null
    imagePreview.value = ''
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    <h3 class="text-xl font-semibold mb-4 text-gray-800">New Expense</h3>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Scan & Save Receipt</label>
      <input type="file" @change="handleFileUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      <p v-if="loading" class="text-xs text-blue-500 mt-1">Analyzing...</p>
      
      <div v-if="imagePreview" class="mt-4 relative">
        <img :src="imagePreview" class="h-32 w-full object-cover rounded-md border" />
        <button @click="resetForm" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"></button>
      </div>
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

      <button @click="submitExpense" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
        {{ loading ? 'Saving...' : 'Save Expense' }}
      </button>
    </div>
  </div>
</template>
