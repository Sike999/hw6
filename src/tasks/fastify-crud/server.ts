import fastify from 'fastify'
import fp from 'fastify-plugin'

import userRoutes  from './userRoutes.ts' 
import dataPlug from './data.ts'
import categoriesRoutes from './categoriesRoutes.ts'
import productsRoutes from './productsRoutes.ts'

const serv = fastify({logger:true, ajv:{customOptions: {removeAdditional: 'all'}}})

    serv.register( async (api) => {
        api.register(fp(dataPlug))
        .register(userRoutes, {prefix: '/users'})
        .register(categoriesRoutes, {prefix:'/categories'})
        .register(productsRoutes, {prefix: '/products'})
    },{prefix: '/api'})
    .listen({port:3000}, () => {
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