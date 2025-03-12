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
interface Icart{
    id:number
    iduser:number
    idproduct:number
    quantity:number
    product :Iproduct
}
interface Iorderitem{
    id:number
    iduser:number
    customer:string
    phone:string
    address:string
    totalPrice:number
    status:string
    createdAt:string
}