<script setup lang="ts">
const props = defineProps(['reminders'])
const emit = defineEmits(['mark-paid', 'edit-reminder', 'delete-reminder', 'convert-to-expense'])
</script>

<template>
  <div class="glass-card p-6 rounded-3xl">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-slate-800">Coming Up</h3>
      <span class="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">{{ reminders.filter(r => !r.is_paid).length }} Active</span>
    </div>
    
    <div v-if="reminders.length === 0" class="text-slate-400 text-center py-12">
      No active reminders. Chill out! 
    </div>
    
    <ul v-else class="space-y-4">
      <li v-for="reminder in reminders" :key="reminder.id" 
        :class="[
          'relative p-4 rounded-2xl transition-all duration-300 group border',
          reminder.is_paid ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-100 hover:shadow-md hover:border-indigo-100'
        ]">
        
        <div class="flex items-center gap-4">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-colors', reminder.is_paid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600']">
            <svg v-if="reminder.is_paid" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <p :class="['font-bold truncate mb-0.5', reminder.is_paid ? 'text-slate-400 line-through' : 'text-slate-800']">{{ reminder.title }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due {{ reminder.due_date }}</p>
          </div>
          
          <div v-if="reminder.amount" class="text-right sr-only sm:not-sr-only">
             <p class="text-sm font-black text-slate-900">&euro; {{ reminder.amount }}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
           <button v-if="!reminder.is_paid" @click="emit('mark-paid', reminder.id)" class="text-[10px] font-black uppercase text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
             Settle
           </button>
           <button v-if="!reminder.is_paid && reminder.amount" @click="emit('convert-to-expense', reminder)" class="text-[10px] font-black uppercase text-indigo-600 px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-nowrap">
              Pay Now
           </button>
           <button @click="emit('edit-reminder', reminder)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
           </button>
           <button @click="emit('delete-reminder', reminder.id)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </button>
        </div>
      </li>
    </ul>
  </div>
</template>
