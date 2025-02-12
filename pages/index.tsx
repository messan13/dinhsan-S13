import Menu from './user/menu';
import Container from 'react-bootstrap/Container';
import Banner from './user/banner'
import Product from './user/sanpham'
import useSWR from 'swr';
export default function Home() {

  return (
    <>
    
      
        <Menu />
        <Container>
        <Banner />
        <Product />
      </Container>
    </>

  );
}
