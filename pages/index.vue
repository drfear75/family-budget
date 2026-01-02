<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const expenses = ref([])
const reminders = ref([])
const incomes = ref([])
const activeTab = ref('expenses')
const dueRemindersCount = ref(0)
const selectedImage = ref("")

// Editing State
const editingItem = ref(null)
const editingType = ref('') // 'expense', 'income', or 'reminder'

const people = ['Massimo', 'Elena']

onMounted(async () => {
    if (user.value) {
        await Promise.all([fetchExpenses(), fetchReminders(), fetchIncomes()])
    }
})

const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (data) expenses.value = data
}

const fetchIncomes = async () => {
    const { data } = await supabase.from('incomes').select('*').order('date', { ascending: false })
    if (data) incomes.value = data
}

const fetchReminders = async () => {
    const { data } = await supabase.from('reminders').select('*').order('due_date', { ascending: true })
     if (data) {
        reminders.value = data
        const today = new Date().toISOString().split('T')[0]
        dueRemindersCount.value = data.filter(r => !r.is_paid && r.due_date <= today).length
    }
}

const markReminderPaid = async (id: number) => {
    const { error } = await supabase.from('reminders').update({ is_paid: true }).eq('id', id)
    if (!error) await fetchReminders()
}

const startEdit = (item: any, type: 'expense' | 'income' | 'reminder') => {
    editingItem.value = { ...item }
    editingType.value = type
}

const cancelEdit = () => {
    editingItem.value = null
    editingType.value = ''
}

const saveEdit = async () => {
    if (!editingItem.value) return
    
    let table = ''
    if (editingType.value === 'expense') table = 'expenses'
    else if (editingType.value === 'income') table = 'incomes'
    else if (editingType.value === 'reminder') table = 'reminders'
    
    // Validate amount if present
     if (editingItem.value.amount && isNaN(parseFloat(editingItem.value.amount))) {
        alert('Please enter a valid amount')
        return
     }
     
     const payload = { ...editingItem.value }
     delete payload.created_at
     if (payload.amount) payload.amount = parseFloat(payload.amount)

    const { error } = await supabase.from(table).update(payload).eq('id', editingItem.value.id)

    if (error) {
        alert('Error updating: ' + error.message)
    } else {
        alert('Updated successfully!')
        editingItem.value = null
        if (editingType.value === 'expense') await fetchExpenses()
        else if (editingType.value === 'income') await fetchIncomes()
        else await fetchReminders()
    }
}

const deleteItem = async (id: number, type: 'expense' | 'income' | 'reminder') => {
    if (!confirm('Are you sure you want to delete this item?')) return
    let table = ''
    if (type === 'expense') table = 'expenses'
    else if (type === 'income') table = 'incomes'
    else if (type === 'reminder') table = 'reminders'
    
    const { error } = await supabase.from(table).delete().eq('id', id)
    
    if (error) {
        alert('Error deleting: ' + error.message)
    } else {
        if (type === 'expense') await fetchExpenses()
        else if (type === 'income') await fetchIncomes()
        else await fetchReminders()
    }
}

const convertReminderToExpense = async (reminder: any) => {
    if (!confirm('Convert this reminder to an expense?')) return
    
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !currentUser) {
        alert('Authentication error')
        return
    }
    
    // Create expense
    const expensePayload = {
        user_id: currentUser.id,
        amount: reminder.amount || 0,
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        description: reminder.title,
        paid_by: 'Massimo'
    }
    
    const { error: expenseError } = await supabase.from('expenses').insert(expensePayload)
    
    if (expenseError) {
        alert('Error creating expense: ' + expenseError.message)
        return
    }
    
    // Mark reminder as paid
    const { error: updateError } = await supabase.from('reminders').update({ is_paid: true }).eq('id', reminder.id)
    
    if (updateError) {
        alert('Expense created but failed to mark reminder as paid')
    } else {
        alert('Reminder converted to expense!')
        await Promise.all([fetchExpenses(), fetchReminders()])
        activeTab.value = 'expenses'
    }
}

watch(user, async (newUser) => {
    if (newUser) await Promise.all([fetchExpenses(), fetchReminders(), fetchIncomes()])
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Family Budget Dashboard</h1>
        <div v-if="user" class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ user.email }}</span>
          <button @click="supabase.auth.signOut()" class="text-sm text-red-600 hover:text-red-800">Sign Out</button>
        </div>
        <NuxtLink v-else to="/login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</NuxtLink>
      </div>

      <div v-if="user">
         <!-- Notification Banner -->
         <div v-if="dueRemindersCount > 0" class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p class="font-bold">Attention Needed</p>
            <p>You have {{ dueRemindersCount }} reminder(s) due or overdue. Please check the Reminders tab.</p>
         </div>

         <!-- Edit Modal -->
         <div v-if="editingItem" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 class="text-xl font-bold mb-4">Edit {{ editingType === 'expense' ? 'Expense' : editingType === 'income' ? 'Income' : 'Reminder' }}</h3>
                <div class="space-y-4">
                     <div v-if="editingType === 'reminder'">
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input v-model="editingItem.title" type="text" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Amount</label>
                        <input v-model="editingItem.amount" type="number" step="0.01" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div v-if="editingType === 'expense'">
                        <label class="block text-sm font-medium text-gray-700">Category</label>
                        <input v-model="editingItem.category" type="text" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div v-if="editingType === 'income'">
                        <label class="block text-sm font-medium text-gray-700">Source</label>
                         <input v-model="editingItem.source" type="text" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div v-if="editingType !== 'reminder'">
                        <label class="block text-sm font-medium text-gray-700">{{ editingType === 'expense' ? 'Paid By' : 'Received By' }}</label>
                        <select v-model="editingItem.paid_by" class="mt-1 block w-full border rounded p-2">
                            <option v-for="person in people" :key="person" :value="person">{{ person }}</option>
                        </select>
                     </div>
                     <div v-if="editingType === 'reminder'">
                        <label class="block text-sm font-medium text-gray-700">Due Date</label>
                        <input v-model="editingItem.due_date" type="date" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div v-else>
                        <label class="block text-sm font-medium text-gray-700">Date</label>
                        <input v-model="editingItem.date" type="date" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <input v-model="editingItem.description" type="text" class="mt-1 block w-full border rounded p-2" />
                     </div>
                     
                     <div v-if="editingItem.image_url" class="mt-2">
                        <label class="block text-sm font-medium text-gray-700">Receipt/Image</label>
                        <img :src="editingItem.image_url" class="h-24 w-full object-cover rounded border cursor-pointer" @click="selectedImage = editingItem.image_url" />
                     </div>

                     <div class="flex justify-end gap-2 mt-4">
                        <button @click="cancelEdit" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button @click="saveEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                     </div>
                </div>
            </div>
         </div>

         <!-- Tabs -->
         <div class="mb-6 border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button @click="activeTab = 'expenses'" :class="[activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                Expenses
              </button>
              <button @click="activeTab = 'incomes'" :class="[activeTab === 'incomes' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                Incomes
              </button>
              <button @click="activeTab = 'reminders'" :class="[activeTab === 'reminders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                Reminders
              </button>
              <button @click="activeTab = 'statistics'" :class="[activeTab === 'statistics' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                Statistics
              </button>
            </nav>
         </div>

         <!-- Expenses View -->
         <div v-if="activeTab === 'expenses'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExpenseForm @expense-saved="fetchExpenses" />
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4 text-gray-800">Recent Expenses</h3>
               <div v-if="expenses.length === 0" class="text-gray-500 text-center py-4">No expenses recorded yet.</div>
               <ul v-else class="space-y-3">
                 <li v-for="expense in expenses" :key="expense.id" class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition group">
                   <div class="flex-1">
                    <div class="flex items-center">
                      <p class="font-medium text-gray-900">{{ expense.description || expense.category }}</p>
                      <button v-if="expense.image_url" @click="selectedImage = expense.image_url" class="ml-2 text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                     <p class="text-xs text-gray-500">{{ expense.date }}  {{ expense.paid_by || 'N/A' }}</p>
                   </div>
                   <div class="flex items-center gap-3">
                       <span class="font-bold text-gray-900">&euro; {{ expense.amount }}</span>
                       <button @click="startEdit(expense, 'expense')" class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-sm">Edit</button>
                       <button @click="deleteItem(expense.id, 'expense')" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-sm">Delete</button>
                   </div>
                 </li>
               </ul>
            </div>
         </div>

         <!-- Incomes View -->
         <div v-if="activeTab === 'incomes'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <IncomeForm @income-saved="fetchIncomes" />
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4 text-gray-800">Recent Incomes</h3>
               <div v-if="incomes.length === 0" class="text-gray-500 text-center py-4">No incomes recorded yet.</div>
               <ul v-else class="space-y-3">
                 <li v-for="income in incomes" :key="income.id" class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition group">
                   <div class="flex-1">
                    <div class="flex items-center">
                      <p class="font-medium text-gray-900">{{ income.description || income.source }}</p>
                      <button v-if="income.image_url" @click="selectedImage = income.image_url" class="ml-2 text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                     <p class="text-xs text-gray-500">{{ income.date }}  {{ income.paid_by || 'N/A' }}</p>
                   </div>
                   <div class="flex items-center gap-3">
                       <span class="font-bold text-green-700">&euro; {{ income.amount }}</span>
                       <button @click="startEdit(income, 'income')" class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-sm">Edit</button>
                       <button @click="deleteItem(income.id, 'income')" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-sm">Delete</button>
                   </div>
                 </li>
               </ul>
            </div>
         </div>

         <!-- Reminders View -->
         <div v-if="activeTab === 'reminders'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReminderForm @reminder-saved="fetchReminders" />
            <ReminderList 
                :reminders="reminders" 
                @mark-paid="markReminderPaid" 
                @edit-reminder="(r) => startEdit(r, 'reminder')"
                @delete-reminder="(id) => deleteItem(id, 'reminder')"
                @convert-to-expense="convertReminderToExpense"
            />
         </div>

         <!-- Statistics View -->
         <div v-if="activeTab === 'statistics'">
            <Statistics :expenses="expenses" :incomes="incomes" />
         </div>

      </div>
      <div v-else class="text-center py-20">
        <h2 class="text-2xl text-gray-700 mb-4">Welcome to Family Budget</h2>
        <p class="text-gray-600 mb-8">Please login to manage your expenses.</p>
        <NuxtLink to="/login" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</NuxtLink>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4" @click="selectedImage = ''">
      <div class="relative max-w-4xl w-full">
        <img :src="selectedImage" class="max-h-[90vh] mx-auto rounded shadow-2xl" />
        <button class="absolute top-[-40px] right-0 text-white text-3xl font-bold">&times;</button>
      </div>
    </div>
  </div>
</template>
