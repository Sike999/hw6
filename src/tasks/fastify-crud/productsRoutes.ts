import { type FastifyPluginAsync } from "fastify";

declare module 'fastify' {
  interface FastifyRequest {
    productRow: FastifyInstance['products'][number] | null,
    productIdx: number
  }
}
const productsRoutes: FastifyPluginAsync = async(instance) => {

    const products = instance.products
    let nextId = instance.lastProductsId + 1

    instance
    .decorateRequest('productRow', null)
    .decorateRequest('productIdx', -1)
    .addHook('preHandler', async function(req){
        req.productIdx = instance.products.findIndex((product) => product.id === (req.params as {id?: number}).id)
        req.productRow = instance.products[req.productIdx] ?? null
    })
    .get('/',
        {schema: {
            querystring:{
                type: 'object', properties: {categoryId: {type: 'number'}, inStock: {type:'boolean'}}
            }
        }}, 
        async(req,rep) => {
            let filteredProducts = [...products]
            if (req.query.categoryId !== undefined) {
                filteredProducts = filteredProducts.filter((product) => 
                    product.categoryId === req.query.categoryId
                )
            }
            if (req.query.inStock !== undefined) {
                filteredProducts = filteredProducts.filter((product) => 
                    product.inStock === req.query.inStock
                )
            }
            return filteredProducts
    })
    .get('/:id',
        {schema: {params: { type: 'object', properties: {id: {type: 'number'}}}}
        }, async(req,rep) => {
            const product = products.find((product) => product.id == req.params.id)
            if(!product) {
                rep.code(404).send({message: 'Товар не найден'})
            }
            return product
    })
    .post('/',
        {schema: {
                body: {
                    type: 'object',
                    required: ['name', 'price', 'categoryId', 'inStock'],
                    properties: {
                        name:  { type: 'string', minLength: 1, maxLength: 100 },
                        price: { type: 'number', minimum: 1, },
                        categoryId: { type: 'number',  minimum: 1,},
                        inStock: { type: 'boolean',}
                    }
                }
            }
        },
        async(req,rep) => {
            if(products.find((product) => product.name === req.body.name)){
                rep.code(409)
                return { error: 'Товар уже существует' }
            }
            const category = instance.categories.find((category) => category.id === req.body.categoryId)
            if(!category){
                rep.code(400)
                return { error: 'Категория не найдена' }
            }
            products.push({
                id: nextId,
                name: req.body.name,
                price: req.body.price,
                categoryId: req.body.categoryId,
                inStock: req.body.inStock,
                createdAt: new Date().toISOString()
            })
            nextId++
            return rep.code(200).send({message: `Создан товар ${req.body.name}`})
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
                    price: { type: 'number', minimum: 1, },
                    categoryId: { type: 'number',  minimum: 1,},
                    inStock: { type: 'boolean',}
                },
                additionalProperties: false,
                minProperties: 1
            }
        }},
        async(req,rep) => {
            if (req.productRow === null) {
                return rep.code(404).send({error: 'Товар не найден'})
            }
            Object.assign(req.productRow, req.body)
            return rep.code(200).send({ 
                message: `Обновлен товар ${req.body.name}`,
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
            if (req.productRow === null) {
                return rep.code(404).send({error: 'Товар не найден'})
            }
            instance.products.splice(req.productIdx, 1);
            return rep.code(200).send({message: `Товар ${req.params.id} удален`})
        }
    )
}
export default productsRoutes