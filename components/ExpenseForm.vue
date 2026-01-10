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

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Insurance', 'Vacation', 'Home', 'Filippo', 'Other']
const people = ['Massimo', 'Elena', 'Conto Mediolanum']

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
  <div class="glass-card p-6 rounded-3xl mb-8">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-800">New Expense</h3>
    </div>
    
    <div class="space-y-5">
      <!-- Image Upload Area -->
      <div class="group relative">
        <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all duration-300 group-hover:scale-[1.01]">
            <div v-if="!imagePreview" class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Snap Receipt</p>
                <p class="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
            <img v-else :src="imagePreview" class="w-full h-full object-cover rounded-2xl" />
            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
            
            <button v-if="imagePreview" @click.stop.prevent="resetForm" class="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors">
              <span class="text-sm font-bold">&times;</span>
            </button>
        </label>
        <div v-if="loading" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
           <div class="flex items-center gap-2 text-indigo-600 font-bold text-sm">
             <div class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             Analyzing...
           </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Amount</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">&euro;</span>
            <input v-model="amount" type="number" step="0.01" class="input-field !pl-12" placeholder="0.00" />
          </div>
        </div>

        <div>
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Category</label>
           <select v-model="category" class="input-field">
               <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
           </select>
        </div>

        <div>
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Paid By</label>
           <select v-model="paidBy" class="input-field">
               <option v-for="person in people" :key="person" :value="person">{{ person }}</option>
           </select>
        </div>

        <div class="col-span-2">
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Date</label>
           <input v-model="date" type="date" class="input-field" />
        </div>
        
        <div class="col-span-2">
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Description</label>
           <input v-model="description" type="text" class="input-field" placeholder="What was it for?" />
        </div>
      </div>

      <button @click="submitExpense" :disabled="loading" class="btn-primary w-full py-4 shadow-lg shadow-indigo-100 mt-2">
        {{ loading ? 'Saving...' : 'Save Expense' }}
      </button>
    </div>
  </div>
</template>


