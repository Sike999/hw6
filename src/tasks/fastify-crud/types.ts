export type category = {
    id: number,
    name: string,
    description: string
}
export type product = {
    id: number,
    name: string,
    price: number,
    categoryId: number,
    inStock: boolean,
    createdAt: string
}
export type user = {
    id: number,
    name: string,
    email: string,
    role: "customer" | "admin",
    createdAt: string
}