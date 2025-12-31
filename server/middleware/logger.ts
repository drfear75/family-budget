export default defineEventHandler((event) => {
  console.log('Request received: ' + event.node.req.url)
})
