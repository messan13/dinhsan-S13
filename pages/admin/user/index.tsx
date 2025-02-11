import { Button } from 'react-bootstrap';
import Tableuser from './tableuser'
import useSWR from 'swr';
export default function gt(){
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR('../../api/user', fetcher,{
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    })
    if(isLoading){
      <div style={{textAlign:"center"}}>loading...</div>
    }
    return(
        <>
    <Tableuser
    users={data?.sort((item1:any,item2:any)=>item2.id - item1.id)}
    />
    </>
    );

}