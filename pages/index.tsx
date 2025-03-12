
import Container from 'react-bootstrap/Container';
import Banner from './user/banner'
import Product from './user/sanpham'
import useSWR from 'swr';
export default function Home() {

  return (
    <>
        <Container>
        <Banner />
        <Product />
      </Container>
    </>

  );
}
