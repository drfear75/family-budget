export default defineEventHandler(async (event) => {
  // In a real app, read the file from the request
  // const body = await readMultipartFormData(event)
  
  // Mock AI delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    amount: (Math.random() * 100).toFixed(2),
    category: ['Food', 'Transport', 'Utilities'][Math.floor(Math.random() * 3)],
    date: new Date().toISOString().split('T')[0],
    description: 'Scanned Receipt Item'
  }
})
