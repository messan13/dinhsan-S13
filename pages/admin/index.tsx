import Menu from './menu';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
export default function Home() {

  return (
    <>
    <Container>
    <Menu />
      <div style={{paddingTop:'100px'}}>
        <Link  href={'/'}>VỀ TRANG USER</Link>
      </div>
      </Container>
    </>
    
  );
}