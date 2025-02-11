import { useState } from "react";
interface IProduct {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
  }
export const useProductCart = () => {
    const [productCart, setProductCart] = useState<IProduct[]>([]);
  
    const addToCart = (item: IProduct) => {
      setProductCart((prev) => [...prev, item]);
    };
  
    const removeFromCart = (id: number) => {
      setProductCart((prev) => prev.filter(item => item.id !== id));
    };
  
    return {
      productCart,
      addToCart,
      removeFromCart
    };
  };