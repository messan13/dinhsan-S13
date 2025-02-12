'use client'
import { useRouter } from 'next/router'
import useSWR, { Fetcher } from 'swr';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
const viewDetail = ()=>{
    const router = useRouter();
    const fetcher :Fetcher<Iuser,string> = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR(`../../api/user/${router.query.iduser}`, fetcher,{
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    })

    return (
        <div>
          
            <Link href={'/admin/user'}>GO BACK</Link>
       <Card style={{ width: '50rem' }}>
      <ListGroup variant="flush" style={{textAlign:'center'}}>
        <ListGroup.Item>ID : {data?.id}</ListGroup.Item>
        <ListGroup.Item>NAME : {data?.name}</ListGroup.Item>
        <ListGroup.Item>PASSWORD : {data?.password}s</ListGroup.Item>
        <ListGroup.Item>EMAIL : {data?.email}s</ListGroup.Item>
        <ListGroup.Item>NGÀY TẠO : {data?.createdAt}s</ListGroup.Item>
      </ListGroup>
    </Card>
        </div>
    )
}
export default viewDetail