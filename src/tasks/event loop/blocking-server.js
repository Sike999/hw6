// Чанкирование позволяет разбить огромный процесс подсчета на несколько кусков, не блокируя event loop полностью,
// а позволяя другим таскам выполниться пока не наступил setImmidiate который зарегистрирует продолжение выполнения вычисления
const fastify = require('fastify')({ logger: true })

fastify.get('/fast', async () => {
  return { message: 'I am fast', timestamp: Date.now() }
})

fastify.get('/slow', async (request, reply) => {
  const limit = 5_000_000_000
  const chunkSize = 100_000_000 
  let sum = 0
  let i = 1

  return new Promise((resolve) => {
    function processChunk() {
      const end = Math.min(i + chunkSize, limit)
      for (; i <= end; i++) {
        sum += i
      }

      if (i < limit) {
        setImmediate(processChunk)
      } else {

        resolve({ result: sum })
      }
    }

    processChunk()
  })
})


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('  curl http://localhost:3000/slow')
    console.log('  curl http://localhost:3000/fast')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await fastify.close()
  console.log('Server closed')
  process.exit(0)
})

start()
