import { data } from "react-router-dom";
import Tableproduct from "./tablepro";
import useSWR from 'swr'
import { useState } from "react";
export default function product(){


    const fetcher = (url:string) => fetch(url).then(res => res.json())
     const { data, error, isLoading } = useSWR('../../api/product', fetcher,{
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    })
  if(isLoading){
    return <div>loding....</div>
  }
    return(
        <>
        <Tableproduct 
        product={data?.sort((a:any,b:any)=>b.id-a.id)}
        />

        </>
    );
}