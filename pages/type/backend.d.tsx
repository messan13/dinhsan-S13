interface Iuser{
    id:number | null,
    password:string,
    name:string | null,
    email:string | null,
    checkAdmin:boolean | null  ,
    createdAt:String,
}
interface Iproduct{
    id:number
    name :string
    description:string
    price:string
    image:string
}