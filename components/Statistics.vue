<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps(['expenses', 'incomes'])

// Calculate totals by category
const expensesByCategory = computed(() => {
  const categories = {}
  props.expenses.forEach(expense => {
    const cat = expense.category || 'Other'
    categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount)
  })
  return categories
})

const incomesBySource = computed(() => {
  const sources = {}
  props.incomes.forEach(income => {
    const src = income.source || 'Other'
    sources[src] = (sources[src] || 0) + parseFloat(income.amount)
  })
  return sources
})

// Calculate by person
const expensesByPerson = computed(() => {
  const people = {}
  props.expenses.forEach(expense => {
    const person = expense.paid_by || 'Unknown'
    people[person] = (people[person] || 0) + parseFloat(expense.amount)
  })
  return people
})

const incomesByPerson = computed(() => {
  const people = {}
  props.incomes.forEach(income => {
    const person = income.paid_by || 'Unknown'
    people[person] = (people[person] || 0) + parseFloat(income.amount)
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

// Chart data
const expenseChartData = computed(() => ({
  labels: Object.keys(expensesByCategory.value),
  datasets: [{
    label: 'Expenses by Category',
    data: Object.values(expensesByCategory.value),
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40'
    ]
  }]
}))

const incomeChartData = computed(() => ({
  labels: Object.keys(incomesBySource.value),
  datasets: [{
    label: 'Incomes by Source',
    data: Object.values(incomesBySource.value),
    backgroundColor: [
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107'
    ]
  }]
}))

const expensesByPersonChart = computed(() => ({
  labels: Object.keys(expensesByPerson.value),
  datasets: [{
    label: 'Expenses by Person',
    data: Object.values(expensesByPerson.value),
    backgroundColor: ['#FF6384', '#36A2EB']
  }]
}))

const incomesByPersonChart = computed(() => ({
  labels: Object.keys(incomesByPerson.value),
  datasets: [{
    label: 'Incomes by Person',
    data: Object.values(incomesByPerson.value),
    backgroundColor: ['#4CAF50', '#8BC34A']
  }]
}))

const comparisonChartData = computed(() => ({
  labels: ['Total'],
  datasets: [
    {
      label: 'Incomes',
      data: [totalIncomes.value],
      backgroundColor: '#4CAF50'
    },
    {
      label: 'Expenses',
      data: [totalExpenses.value],
      backgroundColor: '#F44336'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-green-50 p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-green-800">Total Incomes</h3>
        <p class="text-3xl font-bold text-green-600 mt-2">&euro; {{ totalIncomes.toFixed(2) }}</p>
      </div>
      <div class="bg-red-50 p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-red-800">Total Expenses</h3>
        <p class="text-3xl font-bold text-red-600 mt-2">&euro; {{ totalExpenses.toFixed(2) }}</p>
      </div>
      <div class="p-6 rounded-lg shadow" :class="balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'">
        <h3 class="text-sm font-medium" :class="balance >= 0 ? 'text-blue-800' : 'text-orange-800'">Balance</h3>
        <p class="text-3xl font-bold mt-2" :class="balance >= 0 ? 'text-blue-600' : 'text-orange-600'">&euro; {{ balance.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Charts by Person -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Expenses by Person -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Expenses by Person</h3>
        <div v-if="Object.keys(expensesByPerson).length > 0" style="height: 300px;">
          <Pie :data="expensesByPersonChart" :options="chartOptions" />
        </div>
        <p v-else class="text-gray-500 text-center py-8">No expense data available</p>
        <div v-if="Object.keys(expensesByPerson).length > 0" class="mt-4 space-y-2">
          <div v-for="(amount, person) in expensesByPerson" :key="person" class="flex justify-between text-sm">
            <span class="font-medium">{{ person }}:</span>
            <span class="text-gray-600">&euro; {{ amount.toFixed(2) }} ({{ ((amount / totalExpenses) * 100).toFixed(1) }}%)</span>
          </div>
        </div>
      </div>

      <!-- Incomes by Person -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Incomes by Person</h3>
        <div v-if="Object.keys(incomesByPerson).length > 0" style="height: 300px;">
          <Pie :data="incomesByPersonChart" :options="chartOptions" />
        </div>
        <p v-else class="text-gray-500 text-center py-8">No income data available</p>
        <div v-if="Object.keys(incomesByPerson).length > 0" class="mt-4 space-y-2">
          <div v-for="(amount, person) in incomesByPerson" :key="person" class="flex justify-between text-sm">
            <span class="font-medium">{{ person }}:</span>
            <span class="text-gray-600">&euro; {{ amount.toFixed(2) }} ({{ ((amount / totalIncomes) * 100).toFixed(1) }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts by Category/Source -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Expenses by Category -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Expenses by Category</h3>
        <div v-if="Object.keys(expensesByCategory).length > 0" style="height: 300px;">
          <Pie :data="expenseChartData" :options="chartOptions" />
        </div>
        <p v-else class="text-gray-500 text-center py-8">No expense data available</p>
      </div>

      <!-- Incomes by Source -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Incomes by Source</h3>
        <div v-if="Object.keys(incomesBySource).length > 0" style="height: 300px;">
          <Pie :data="incomeChartData" :options="chartOptions" />
        </div>
        <p v-else class="text-gray-500 text-center py-8">No income data available</p>
      </div>
    </div>

    <!-- Income vs Expenses Comparison -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Income vs Expenses</h3>
      <div style="height: 300px;">
        <Bar :data="comparisonChartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Category Breakdown Table -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Expense Breakdown</h3>
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">Category</th>
            <th class="text-right py-2">Amount</th>
            <th class="text-right py-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(amount, category) in expensesByCategory" :key="category" class="border-b">
            <td class="py-2">{{ category }}</td>
            <td class="text-right">&euro; {{ amount.toFixed(2) }}</td>
            <td class="text-right">{{ ((amount / totalExpenses) * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="font-bold">
            <td class="py-2">Total</td>
            <td class="text-right">&euro; {{ totalExpenses.toFixed(2) }}</td>
            <td class="text-right">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
