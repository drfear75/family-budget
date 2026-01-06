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

const people = ['Massimo', 'Elena', 'Conto Mediolanum']

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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Food': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Transport': 'bg-sky-50 text-sky-700 border-sky-100',
    'Utilities': 'bg-amber-50 text-amber-700 border-amber-100',
    'Entertainment': 'bg-purple-50 text-purple-700 border-purple-100',
    'Health': 'bg-rose-50 text-rose-700 border-rose-100',
    'Insurance': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Vacation': 'bg-pink-50 text-pink-700 border-pink-100',
    'Other': 'bg-slate-50 text-slate-700 border-slate-100'
  }
  return colors[category] || colors['Other']
}

const totalEx = computed(() => expenses.value.reduce((s, e) => s + parseFloat(e.amount), 0))
const totalIn = computed(() => incomes.value.reduce((s, e) => s + parseFloat(e.amount), 0))
const balance = computed(() => totalIn.value - totalEx.value)

const tabs = [
  { id: 'expenses', name: 'Expenses', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'incomes', name: 'Incomes', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { id: 'reminders', name: 'Reminders', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'statistics', name: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
]
</script>

<template>
  <div class="min-h-screen gradient-bg pb-20 sm:pb-8">
    <!-- Header -->
    <header class="glass-card sticky top-0 z-40 px-4 py-4 mb-6">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Home Budget</h1>
            <p v-if="user" class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{{ user.email?.split('@')[0] }}</p>
          </div>
        </div>

        <div v-if="user" class="flex items-center gap-4">
          <div class="hidden sm:block text-right">
             <p class="text-[10px] text-slate-500 font-bold uppercase">Main Balance</p>
             <p class="text-lg font-bold" :class="balance >= 0 ? 'text-emerald-600' : 'text-rose-600'">&euro; {{ balance.toFixed(2) }}</p>
          </div>
          <button @click="supabase.auth.signOut()" class="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <NuxtLink v-else to="/login" class="btn-primary">Login</NuxtLink>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4">
      <div v-if="user">
         <!-- Notification Banner -->
         <div v-if="dueRemindersCount > 0" class="mb-6 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3 animate-slide-up" role="alert">
            <div class="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
              <span class="font-bold text-rose-600">!</span>
            </div>
            <div>
              <p class="font-bold text-sm">Attention Needed</p>
              <p class="text-xs">You have {{ dueRemindersCount }} overdue reminder(s).</p>
            </div>
         </div>

         <!-- Edit Modal -->
         <Teleport to="body">
           <div v-if="editingItem" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
              <div class="glass-card p-6 rounded-3xl w-full max-w-md animate-slide-up">
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Edit {{ editingType }}</h3>
                    <button @click="cancelEdit" class="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
                  </div>
                  <div class="space-y-4">
                       <div v-if="editingType === 'reminder'">
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                          <input v-model="editingItem.title" type="text" class="input-field" />
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                          <input v-model="editingItem.amount" type="number" step="0.01" class="input-field" />
                       </div>
                       <div v-if="editingType === 'expense'">
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                          <input v-model="editingItem.category" type="text" class="input-field" />
                       </div>
                       <div v-if="editingType === 'income'">
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Source</label>
                           <input v-model="editingItem.source" type="text" class="input-field" />
                       </div>
                       <div v-if="editingType !== 'reminder'">
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">{{ editingType === 'expense' ? 'Paid By' : 'Received By' }}</label>
                          <select v-model="editingItem.paid_by" class="input-field">
                              <option v-for="person in people" :key="person" :value="person">{{ person }}</option>
                          </select>
                       </div>
                       <div v-if="editingType === 'reminder'">
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                          <input v-model="editingItem.due_date" type="date" class="input-field" />
                       </div>
                       <div v-else>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                          <input v-model="editingItem.date" type="date" class="input-field" />
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                          <input v-model="editingItem.description" type="text" class="input-field" />
                       </div>
                       
                       <div class="flex gap-3 pt-4">
                          <button @click="cancelEdit" class="btn-secondary flex-1">Cancel</button>
                          <button @click="saveEdit" class="btn-primary flex-1">Save</button>
                       </div>
                  </div>
              </div>
           </div>
         </Teleport>

         <!-- Tabs (Navigation) -->
         <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50 px-4 py-2 sm:relative sm:bg-transparent sm:border-0 sm:mb-8 sm:p-0">
            <div class="flex justify-between sm:justify-start gap-2 bg-slate-100/50 p-1.5 rounded-2xl max-w-6xl mx-auto sm:w-fit">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" 
                :class="[activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700', 'flex-1 sm:flex-none flex flex-col sm:flex-row items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300']">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                </svg>
                <span class="text-[10px] sm:text-sm">{{ tab.name }}</span>
              </button>
            </div>
         </nav>

         <!-- Views -->
         <div class="animate-slide-up">
           <!-- Expenses View -->
           <div v-if="activeTab === 'expenses'" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div class="lg:col-span-2">
                <ExpenseForm @expense-saved="fetchExpenses" />
              </div>
              <div class="lg:col-span-3 glass-card p-6 rounded-3xl">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-slate-800">Recent Transactions</h3>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ expenses.length }} Items</p>
                </div>
                 <div v-if="expenses.length === 0" class="text-slate-400 text-center py-12">
                   <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   No expenses recorded yet.
                 </div>
                 <ul v-else class="space-y-4">
                   <li v-for="expense in expenses" :key="expense.id" class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group ring-1 ring-slate-100 hover:ring-indigo-100">
                     <div class="flex items-center gap-4 flex-1">
                        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm', getCategoryColor(expense.category).split(' ')[0].replace('bg-', 'bg-').replace('-50', '-100')]">
                           <span class="text-lg"></span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-0.5">
                            <p class="font-bold text-slate-800 truncate">{{ expense.description || expense.category }}</p>
                            <span :class="['px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border border-opacity-20 shadow-sm shrink-0', getCategoryColor(expense.category)]">
                               {{ expense.category }}
                            </span>
                          </div>
                          <div class="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                            <p>{{ expense.date }}</p>
                            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <p>{{ expense.paid_by || 'Unknown' }}</p>
                          </div>
                        </div>
                     </div>
                     <div class="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                         <div class="text-right">
                           <span class="text-lg font-black text-slate-900">&euro; {{ expense.amount.toFixed(2) }}</span>
                         </div>
                         <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button v-if="expense.image_url" @click="selectedImage = expense.image_url" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Receipt">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button @click="startEdit(expense, 'expense')" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button @click="deleteItem(expense.id, 'expense')" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                         </div>
                     </div>
                   </li>
                 </ul>
              </div>
           </div>

           <!-- Incomes View -->
           <div v-if="activeTab === 'incomes'" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div class="lg:col-span-2">
                <IncomeForm @income-saved="fetchIncomes" />
              </div>
              <div class="lg:col-span-3 glass-card p-6 rounded-3xl">
                <h3 class="text-xl font-bold mb-6 text-slate-800">Recent Incomes</h3>
                 <div v-if="incomes.length === 0" class="text-slate-400 text-center py-12">No incomes recorded yet.</div>
                 <ul v-else class="space-y-4">
                   <li v-for="income in incomes" :key="income.id" class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group ring-1 ring-slate-100 hover:ring-emerald-100">
                     <div class="flex items-center gap-4 flex-1">
                        <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-200 text-lg"></div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-slate-800 truncate mb-0.5">{{ income.description || income.source }}</p>
                          <div class="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                            <p class="text-emerald-600 uppercase font-black tracking-tighter">{{ income.source }}</p>
                            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <p>{{ income.date }}</p>
                          </div>
                        </div>
                     </div>
                     <div class="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                        <span class="text-lg font-black text-emerald-600">&euro; {{ income.amount.toFixed(2) }}</span>
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                            <button @click="startEdit(income, 'income')" class="p-2 hover:text-indigo-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                            <button @click="deleteItem(income.id, 'income')" class="p-2 hover:text-rose-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                     </div>
                   </li>
                 </ul>
              </div>
           </div>

           <!-- Reminders View -->
           <div v-if="activeTab === 'reminders'" class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div class="lg:col-span-2">
                <ReminderForm @reminder-saved="fetchReminders" />
              </div>
              <div class="lg:col-span-3">
                <ReminderList 
                    :reminders="reminders" 
                    @mark-paid="markReminderPaid" 
                    @edit-reminder="(r) => startEdit(r, 'reminder')"
                    @delete-reminder="(id) => deleteItem(id, 'reminder')"
                    @convert-to-expense="convertReminderToExpense"
                />
              </div>
           </div>

           <!-- Statistics View -->
           <div v-if="activeTab === 'statistics'" class="space-y-8">
              <Statistics :expenses="expenses" :incomes="incomes" />
           </div>
         </div>

      </div>
      <div v-else class="text-center py-32 animate-slide-up">
        <div class="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100/50">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
           </svg>
        </div>
        <h2 class="text-4xl font-black text-slate-900 mb-4 tracking-tight">Track Your Wealth</h2>
        <p class="text-slate-500 mb-10 text-lg max-w-md mx-auto">Master your finances with our elegant family budget tracker. Simple, powerful, and secure.</p>
        <NuxtLink to="/login" class="btn-primary py-4 px-10 text-lg">Get Started Now</NuxtLink>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="selectedImage" class="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4 sm:p-12" @click="selectedImage = ''">
        <div class="relative max-w-5xl w-full h-full flex items-center justify-center">
          <img :src="selectedImage" class="max-h-full max-w-full object-contain rounded-2xl shadow-2xl animate-slide-up" />
          <button class="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.btn-primary {
  @apply bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-300;
}
</style>
