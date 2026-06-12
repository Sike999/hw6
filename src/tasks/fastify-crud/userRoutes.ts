import { type FastifyPluginAsync } from "fastify";

declare module 'fastify' {
  interface FastifyRequest {
    userRow: FastifyInstance['users'][number] | null,
    userIdx: number
  }
}
const userRoutes: FastifyPluginAsync = async(instance) => {

    const users = instance.users
    let nextId = instance.lastUsersId + 1

    instance
    .decorateRequest('userRow', null)
    .decorateRequest('userIdx', -1)
    .addHook('preHandler', async function(req){
        req.userIdx = instance.users.findIndex((user) => user.id === (req.params as {id?: number}).id)
        req.userRow = instance.users[req.userIdx] ?? null
    })
    .get('/', 
        {schema:
            {querystring: {type: 'object', properties: {role: {type: 'string', enum: ['customer','admin']}}}}
        }, async(req) => {
                if(req.query.role === 'customer') {
                    return users.filter((user) => user.role !== 'admin')
                }
                if(req.query.role === 'admin') {
                    return users.filter((user) => user.role !== 'customer')
                }
                return users
    })
    .get('/:id', 
        {schema: {params: { type: 'object', properties: {id: {type: 'number'}}}}
        }, async(req,rep) => {
            const user = users.find((user) => user.id == req.params.id)
            if(!user) {
                rep.code(404).send({message: 'Пользователь не найден'})
            }
            return user
    })
    .post('/',
        {schema: {
                body: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name:  { type: 'string', minLength: 1, maxLength: 100 },
                        email: { type: 'string', minLength: 1, maxLength: 100 },
                        role:  { type: 'string', enum: ['customer', 'admin'] }
                    }
                }
            }
        },
        async(req,res) => {
            if(users.find((user) => user.email === req.body.email)){
                res.code(409)
                return { error: 'Email уже существует' }
            }
            users.push({
                id: nextId,
                name: req.body.name,
                email: req.body.email,
                role: req.body.role ? req.body.role : 'customer',
                createdAt: new Date().toISOString()
            })
            nextId++
            return `Создан пользователь ${req.body.name}`
        } 
    )
    .patch('/:id',
        {schema : {
            params: {
                type: 'object', properties: {
                    id: {type: 'number'}
                }
            },
            body: {
                    type: 'object',
                    properties: {
                        name:  { type: 'string', minLength: 1, maxLength: 100 },
                        email: { type: 'string', minLength: 1, maxLength: 100 },
                    },
                    additionalProperties: false,
                    minProperties: 1
                }
        }},
        async(req,rep) => {
            if (req.userRow === null) {
                return rep.code(404).send({error: 'Пользователь не найден'})
            }
            if(users.find((user) => user.email === req.body.email)){
                rep.code(409)
                return { error: 'Email уже существует' }
            }
            Object.assign(req.userRow, req.body)
            return rep.code(200).send({ 
                message: `Обновлен пользователь с id ${req.userIdx + 1}`,
            })
    })
    .delete('/:id',
        {schema: {
            params: {
                type: 'object', properties: {
                    id: {type: 'number'}
                }
            },
        }},
        async(req,rep) => {
            if (req.userRow === null) {
                return rep.code(404).send({error: 'Пользователь не найден'})
            }
            instance.users.splice(req.userIdx, 1);
            return rep.code(200).send({message: `Пользователь с id ${req.userIdx + 1} удален`})
        }
    )
}
export default userRoutes