import Menu from './menu';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
export default function Home() {

  return (
    <>
      <Menu />
    <Container>
      <div style={{paddingTop:'100px'}}>
        <Link  href={'/'}>VỀ TRANG USER</Link>
      </div>
      </Container>
    </>
    
  );
}