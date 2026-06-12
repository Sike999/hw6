import type {category, product, user} from './types.ts'
import { type FastifyPluginAsync } from "fastify";

declare module 'fastify' {
    interface FastifyInstance {
        categories: category[]
        products: product[]
        users: user[]
        lastCategoriesId: number
        lastProductsId: number
        lastUsersId: number
    }
}

const categories:category[] = [
    {
        "id": 1,
        "name": "Электроника",
        "description": "Смартфоны, ноутбуки, планшеты и другие электронные устройства"
    },
    {
        "id": 2,
        "name": "Одежда",
        "description": "Мужская, женская и детская одежда от ведущих брендов"
    },
    {
        "id": 3,
        "name": "Дом и сад",
        "description": "Товары для дома, дачи и садоводства"
    },
    {
        "id": 4,
        "name": "Спорт и отдых",
        "description": "Спортивный инвентарь, экипировка и туристическое снаряжение"
    },
    {
        "id": 5,
        "name": "Книги",
        "description": "Фантастика, детектив"
    }
]

const products:product[] = [
    {
        "id": 1,
        "name": "Смартфон iPhone 15 Pro",
        "price": 99900,
        "categoryId": 1,
        "inStock": true,
        "createdAt": "2025-11-15T10:30:00.000Z"
    },
    {
        "id": 2,
        "name": "Ноутбук MacBook Air M2",
        "price": 119900,
        "categoryId": 1,
        "inStock": true,
        "createdAt": "2025-11-20T14:15:00.000Z"
    },
    {
        "id": 3,
        "name": "Футболка хлопковая белая",
        "price": 1499,
        "categoryId": 2,
        "inStock": true,
        "createdAt": "2025-12-01T09:00:00.000Z"
    },
    {
        "id": 4,
        "name": "Джинсы классические синие",
        "price": 3999,
        "categoryId": 2,
        "inStock": false,
        "createdAt": "2025-12-05T16:20:00.000Z"
    },
    {
        "id": 5,
        "name": "Набор кастрюль 3 шт",
        "price": 5499,
        "categoryId": 3,
        "inStock": true,
        "createdAt": "2026-01-10T11:45:00.000Z"
    },
    {
        "id": 6,
        "name": "Фитнес-браслет",
        "price": 3990,
        "categoryId": 4,
        "inStock": true,
        "createdAt": "2026-01-15T08:30:00.000Z"
    },
    {
        "id": 7,
        "name": "Бестселлер '1984' Джордж Оруэлл",
        "price": 499,
        "categoryId": 5,
        "inStock": true,
        "createdAt": "2026-01-20T13:10:00.000Z"
    },
    {
        "id": 8,
        "name": "Беспроводные наушники AirPods Pro",
        "price": 24990,
        "categoryId": 1,
        "inStock": true,
        "createdAt": "2026-01-25T17:55:00.000Z"
    },
    {
        "id": 9,
        "name": "Куртка зимняя пуховая",
        "price": 12999,
        "categoryId": 2,
        "inStock": false,
        "createdAt": "2026-02-01T10:00:00.000Z"
    },
    {
        "id": 10,
        "name": "Робот-пылесос",
        "price": 18990,
        "categoryId": 3,
        "inStock": true,
        "createdAt": "2026-02-05T12:25:00.000Z"
    }
]
const users:user[] = [
  {
    "id": 1,
    "name": "Иван Петров",
    "email": "ivan.petrov@example.com",
    "role": "customer",
    "createdAt": "2025-10-01T09:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Мария Сидорова",
    "email": "maria.sidorova@example.com",
    "role": "customer",
    "createdAt": "2025-10-15T14:30:00.000Z"
  },
  {
    "id": 3,
    "name": "Алексей Иванов",
    "email": "alexey.ivanov@example.com",
    "role": "admin",
    "createdAt": "2025-11-01T11:20:00.000Z"
  },
  {
    "id": 4,
    "name": "Елена Козлова",
    "email": "elena.kozlov@example.com",
    "role": "customer",
    "createdAt": "2025-11-15T16:45:00.000Z"
  },
  {
    "id": 5,
    "name": "Дмитрий Соколов",
    "email": "dmitry.sokolov@example.com",
    "role": "customer",
    "createdAt": "2025-12-01T10:15:00.000Z"
  },
  {
    "id": 6,
    "name": "Анна Морозова",
    "email": "anna.morozova@example.com",
    "role": "admin",
    "createdAt": "2025-12-10T13:40:00.000Z"
  },
  {
    "id": 7,
    "name": "Сергей Волков",
    "email": "sergey.volkov@example.com",
    "role": "customer",
    "createdAt": "2026-01-05T09:55:00.000Z"
  }
]

let lastCategoriesId = categories.length
let lastProductsId = products.length
let lastUsersId = users.length

const dataPlug: FastifyPluginAsync = async(instance) => {
    instance
        .decorate('categories', categories)
        .decorate('products', products)
        .decorate('users', users)
        .decorate('lastCategoriesId', lastCategoriesId)
        .decorate('lastProductsId', lastProductsId)
        .decorate('lastUsersId', lastUsersId)
}
export default dataPlug
