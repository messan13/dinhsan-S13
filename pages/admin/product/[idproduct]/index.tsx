import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
export default function viewpro(){
        const router = useRouter();
        const fetcher:Fetcher<Iproduct,string> =(url:string)=>fetch(url).then(res=>res.json())
        const {data,error,isLoading}=useSWR(`../../../api/product/${router.query.idproduct}`,fetcher,{
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
          })


    return(
        <div>
          
        <Link href={'/admin/product'}>GO BACK</Link>
   <Card style={{ width: '50rem' }}>
  <ListGroup variant="flush" style={{textAlign:'center'}}>
    <ListGroup.Item>ID : {data?.id}</ListGroup.Item>
    <ListGroup.Item>NAME : {data?.name}</ListGroup.Item>
    <ListGroup.Item>PRICE : {data?.price}</ListGroup.Item>
    <ListGroup.Item>image : {data?.image}s</ListGroup.Item>
  </ListGroup>
</Card>
    </div>
    );
}