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
const people = ['Massimo', 'Elena', 'Conto Mediolanum']

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
  <div class="glass-card p-6 rounded-3xl mb-8">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-800">New Income</h3>
    </div>
    
    <div class="space-y-5">
      <div class="group relative">
        <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300">
            <div v-if="!imagePreview" class="flex flex-col items-center justify-center text-center px-4">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attach Proof</p>
                <p class="text-[9px] text-slate-400 mt-1">Optional image or screenshot</p>
            </div>
            <img v-else :src="imagePreview" class="w-full h-full object-cover rounded-2xl" />
            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Amount</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">&euro;</span>
            <input v-model="amount" type="number" step="0.01" class="input-field !pl-12 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10" placeholder="0.00" />
          </div>
        </div>

        <div>
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Source</label>
           <select v-model="source" class="input-field">
               <option v-for="src in sources" :key="src" :value="src">{{ src }}</option>
           </select>
        </div>

        <div>
           <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Received By</label>
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
           <input v-model="description" type="text" class="input-field" placeholder="Where did it come from?" />
        </div>
      </div>

      <button @click="submitIncome" :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-100 mt-2 disabled:bg-slate-300">
        {{ loading ? 'Saving...' : 'Save Income' }}
      </button>
    </div>
  </div>
</template>


