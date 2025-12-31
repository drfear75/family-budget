<script setup lang="ts">
const props = defineProps(['reminders'])
const emit = defineEmits(['mark-paid', 'edit-reminder', 'delete-reminder', 'convert-to-expense'])
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-4 text-gray-800">Upcoming Reminders</h3>
    <div v-if="reminders.length === 0" class="text-gray-500 text-center py-4">
      No active reminders.
    </div>
    <ul v-else class="space-y-3">
      <li v-for="reminder in reminders" :key="reminder.id" class="flex justify-between items-center p-3 border-l-4 rounded bg-gray-50 hover:bg-gray-100 transition group" :class="reminder.is_paid ? 'border-green-500' : 'border-orange-500'">
        <div>
          <p class="font-medium text-gray-900" :class="{'line-through text-gray-400': reminder.is_paid}">{{ reminder.title }}</p>
          <p class="text-xs text-gray-500">Due: {{ reminder.due_date }}</p>
        </div>
        <div class="flex items-center gap-2">
           <span v-if="reminder.amount" class="font-bold text-gray-700">$ {{ reminder.amount }}</span>
           <button v-if="!reminder.is_paid" @click="emit('mark-paid', reminder.id)" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
             Mark Paid
           </button>
           <button v-if="!reminder.is_paid && reminder.amount" @click="emit('convert-to-expense', reminder)" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition">
              Expense
           </button>
           <button @click="emit('edit-reminder', reminder)" class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-xs">Edit</button>
           <button @click="emit('delete-reminder', reminder.id)" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-xs">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
