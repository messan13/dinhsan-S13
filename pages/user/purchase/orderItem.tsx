export default async function orderItem(id: number) {
    const res = await fetch(`http://localhost:3000/api/orderItem?id=${id}`);
    if (!res.ok) throw new Error("Lỗi khi tải chi tiết đơn hàng");
    return res.json();
  }