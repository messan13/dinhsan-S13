import { useSession } from 'next-auth/react';
import useSWR from 'swr';


export default function Cart() {
  const { data: session, status } = useSession();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    session ? `http://localhost:3000/api/carts/${session.user.id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );


  if (error) {
    return <i className="bi bi-cart4"> Lỗi khi tải giỏ hàng</i>;
  }

  // Kiểm tra nếu có dữ liệu giỏ hàng
  return (
    <>
      <i className="bi bi-cart4"> </i> {data?.length || ""}
    </>
  );
}
