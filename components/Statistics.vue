<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar, Line } from 'vue-chartjs'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps(['expenses', 'incomes'])

const expandedCategory = ref<string | null>(null)

const toggleCategory = (category: string) => {
  if (expandedCategory.value === category) {
    expandedCategory.value = null
  } else {
    expandedCategory.value = category
  }
}

const expensesByCategory = computed(() => {
  const categories = {}
  props.expenses.forEach(expense => {
    const cat = expense.category || 'Other'
    categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount)
  })
  return categories
})

const getExpensesForCategory = (category: string) => {
  return props.expenses
    .filter(e => (e.category || 'Other') === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const incomesBySource = computed(() => {
  const sources = {}
  props.incomes.forEach(income => {
    const src = income.source || 'Other'
    sources[src] = (sources[src] || 0) + parseFloat(income.amount)
  })
  return sources
})

const expensesByPerson = computed(() => {
  const people = {}
  props.expenses.forEach(expense => {
    const person = expense.paid_by || 'Unknown'
    people[person] = (people[person] || 0) + parseFloat(expense.amount)
  })
  return people
})

const totalExpenses = computed(() => {
  return props.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
})

const totalIncomes = computed(() => {
  return props.incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0)
})

const balance = computed(() => totalIncomes.value - totalExpenses.value)

const expenseChartData = computed(() => ({
  labels: Object.keys(expensesByCategory.value),
  datasets: [{
    label: 'Expenses',
    data: Object.values(expensesByCategory.value),
    backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'],
    borderWidth: 0,
    hoverOffset: 20
  }]
}))

const incomeChartData = computed(() => ({
  labels: Object.keys(incomesBySource.value),
  datasets: [{
    label: 'Incomes',
    data: Object.values(incomesBySource.value),
    backgroundColor: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
    borderWidth: 0
  }]
}))

const expensesByPersonChart = computed(() => ({
  labels: Object.keys(expensesByPerson.value),
  datasets: [{
    label: 'People',
    data: Object.values(expensesByPerson.value),
    backgroundColor: ['#6366F1', '#F43F5E', '#F59E0B'],
    borderWidth: 0
  }]
}))

const monthlyTrend = computed(() => {
  const dataMap = {}
  props.incomes.forEach(inc => {
    const month = inc.date.substring(0, 7)
    if (!dataMap[month]) dataMap[month] = { income: 0, expense: 0 }
    dataMap[month].income += parseFloat(inc.amount)
  })
  props.expenses.forEach(exp => {
    const month = exp.date.substring(0, 7)
    if (!dataMap[month]) dataMap[month] = { income: 0, expense: 0 }
    dataMap[month].expense += parseFloat(exp.amount)
  })
  const sortedMonths = Object.keys(dataMap).sort()
  return {
    labels: sortedMonths,
    datasets: [
      { label: 'Incomes', data: sortedMonths.map(m => dataMap[m].income), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
      { label: 'Expenses', data: sortedMonths.map(m => dataMap[m].expense), borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'Outfit', weight: 'bold', size: 10 } } }
  },
  scales: { x: { display: false }, y: { display: false } }
}

const lineOptions = {
    ...chartOptions,
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="glass-card p-4 sm:p-6 rounded-3xl border-emerald-100 shadow-emerald-50 bg-emerald-50/20">
        <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Incomes</p>
        <p class="text-2xl sm:text-3xl font-black text-slate-900">&euro; {{ totalIncomes.toFixed(2) }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-3xl border-rose-100 shadow-rose-50 bg-rose-50/20">
        <p class="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Total Expenses</p>
        <p class="text-2xl sm:text-3xl font-black text-slate-900">&euro; {{ totalExpenses.toFixed(2) }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-3xl col-span-2 md:col-span-1 shadow-indigo-50 bg-white" :class="balance >= 0 ? 'border-indigo-100' : 'border-rose-100'">
        <p class="text-[10px] font-black uppercase tracking-widest mb-1" :class="balance >= 0 ? 'text-indigo-600' : 'text-rose-600'">Current Balance</p>
        <p class="text-2xl sm:text-3xl font-black text-slate-900">&euro; {{ balance.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Charts Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="glass-card p-6 rounded-3xl">
        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Expenses By Category</h3>
        <div style="height: 250px;">
          <Pie :data="expenseChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="glass-card p-6 rounded-3xl">
        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Monthly Trend</h3>
        <div style="height: 250px;">
          <Line :data="monthlyTrend" :options="lineOptions" />
        </div>
      </div>

      <div class="glass-card p-6 rounded-3xl">
        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Split By Person</h3>
        <div style="height: 250px;">
          <Pie :data="expensesByPersonChart" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Breakdown Table with Drilldown -->
    <div class="glass-card overflow-hidden rounded-3xl">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-800">Category Breakdown</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click a row to see details</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50">
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Share (%)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <template v-for="(amount, category) in expensesByCategory" :key="category">
              <!-- Category Row -->
              <tr @click="toggleCategory(category)" class="hover:bg-slate-50/80 cursor-pointer transition-all duration-300 group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: expenseChartData.datasets[0].backgroundColor[Object.keys(expensesByCategory).indexOf(category) % 8] }"></div>
                    <span class="font-bold text-slate-700">{{ category }}</span>
                    <svg :class="['w-4 h-4 text-slate-300 transition-transform duration-300 group-hover:text-indigo-400', expandedCategory === category ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 text-right font-black text-slate-900">&euro; {{ amount.toFixed(2) }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 font-medium text-slate-400 text-sm">
                     {{ ((amount / totalExpenses) * 100).toFixed(1) }}%
                  </div>
                </td>
              </tr>
              
              <!-- Drilldown Details -->
              <tr v-if="expandedCategory === category" class="bg-indigo-50/30">
                <td colspan="3" class="px-6 py-6 transition-all duration-500 animate-slide-up">
                   <div class="space-y-3">
                      <div v-for="ex in getExpensesForCategory(category)" :key="ex.id" class="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-indigo-100/50">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs"></div>
                           <div>
                             <p class="text-sm font-bold text-slate-800">{{ ex.description || 'No description' }}</p>
                             <div class="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                               <span>{{ ex.date }}</span>
                               <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                               <span>{{ ex.paid_by }}</span>
                             </div>
                           </div>
                        </div>
                        <p class="font-black text-slate-900">&euro; {{ parseFloat(ex.amount).toFixed(2) }}</p>
                      </div>
                   </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
