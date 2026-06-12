import { type FastifyPluginAsync } from "fastify";

declare module 'fastify' {
  interface FastifyRequest {
    categoryRow: FastifyInstance['categories'][number] | null,
    categoryIdx: number
  }
}
const categoriesRoutes: FastifyPluginAsync = async(instance) => {

    const categories = instance.categories
    let nextId = instance.lastCategoriesId + 1

    instance
    .decorateRequest('categoryRow', null)
    .decorateRequest('categoryIdx', -1)
    .addHook('preHandler', async function(req){
        req.categoryIdx = instance.categories.findIndex((category) => category.id === (req.params as {id?: number}).id)
        req.categoryRow = instance.categories[req.categoryIdx] ?? null
    })
    .get('/', async() => {
                return categories
    })
    .get('/:id', 
        {schema: {params: { type: 'object', properties: {id: {type: 'number'}}}}
        }, async(req,rep) => {
            const category = categories.find((category) => category.id == req.params.id)
            if(!category) {
                rep.code(404).send({message: 'Категория не найдена'})
            }
            return category
    })
    .post('/',
        {schema: {
                body: {
                    type: 'object',
                    required: ['name', 'description'],
                    properties: {
                        name:  { type: 'string', minLength: 1, maxLength: 100 },
                        description: { type: 'string', minLength: 1, maxLength: 100 }
                    }
                }
            }
        },
        async(req,rep) => {
            if(categories.find((category) => category.name === req.body.name)){
                rep.code(409)
                return { error: 'Категория уже существует' }
            }
            categories.push({
                id: nextId,
                name: req.body.name,
                description: req.body.description,
            })
            nextId++
            return rep.code(200).send({message: `Создана категория ${req.body.name}`})
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
                        description: { type: 'string', minLength: 1, maxLength: 100 },
                    },
                    additionalProperties: false,
                    minProperties: 1
                }
        }},
        async(req,rep) => {
            if (req.categoryRow === null) {
                return rep.code(404).send({error: 'Категория не найдена'})
            }
            Object.assign(req.categoryRow, req.body)
            return rep.code(200).send({ 
                message: `Обновлена категория ${req.categoryRow.name}`,
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
            if (req.categoryRow === null) {
                return rep.code(404).send({error: 'Категория не найдена'})
            }
            const contains = instance.products.some(product => product.categoryId === req.params.id)
            if (contains) {
                return rep.code(400).send({error: 'Категория не пуста!'})
            }
            instance.categories.splice(req.categoryIdx, 1);
            return rep.code(200).send({message: `Категория ${req.params.id} удалена`})
        }
    )
}
export default categoriesRoutes