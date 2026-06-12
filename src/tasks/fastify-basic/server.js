import fastify from 'fastify'

const serv = fastify({logger:true})
    serv.get('/', async() => {
        return { message: 'Server is running' }
    })
    serv.get('/health', async() => {
        return { status:'ok', uptime: process.uptime()}
    })
    serv.get('/time', async() => {
        return { iso: new Date().toISOString(), unix: Date.now()}
    })
    serv.listen({port:3000}, () => {
        console.log("server on http://localhost:3000")
    })

    const gracefulShutdown = async () => {
        console.log(`\nShutting down...`)
        serv.close()
        console.log('Server closed')
        process.exit(0)
}

process.on('SIGINT', () => gracefulShutdown())
process.on('SIGTERM', () => gracefulShutdown())