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

const selectedFile = ref<File | null>(null)
const imagePreview = ref('')

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const uploadImage = async () => {
    if (!selectedFile.value) return null
    
    const fileExt = selectedFile.value.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `incomes/${user.value?.id}/${fileName}`

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

const submitIncome = async () => {
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
            source: source.value,
            date: date.value,
            description: description.value,
            paid_by: paidBy.value,
            image_url: uploadedUrl
        }

        const { error } = await supabase.from('incomes').insert(payload)

        if (error) {
            alert('Error saving income: ' + error.message)
        } else {
            alert('Income saved!')
            emit('income-saved')
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
    <h3 class="text-xl font-semibold mb-4 text-green-700">New Income</h3>
    
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Attach Image (Optional)</label>
      <input type="file" @change="handleFileUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
      
      <div v-if="imagePreview" class="mt-4 relative">
        <img :src="imagePreview" class="h-32 w-full object-cover rounded-md border" />
        <button @click="resetForm" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"></button>
      </div>
    </div>

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

      <button @click="submitIncome" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
        {{ loading ? 'Saving...' : 'Save Income' }}
      </button>
    </div>
  </div>
</template>
