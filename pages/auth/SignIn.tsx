import { signIn } from "next-auth/react";
import { useState ,useEffect } from "react";
import { useRouter } from "next/router";
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import {toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { errors } = router.query;
  useEffect(() => {
    if (errors === 'unauthorized') {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục!");
    }
    if (errors === 'forbidden') {
      toast.error("Bạn không đủ quyền truy cập trang vừa rồi! Hãy đăng nhập tài khoản Admin để tiếp tục "); 
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      name: username,
      password,
    });

    if (res?.error) {
      toast.error("Đăng nhập thất bại!")
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    } else {
      router.push("/"); 
    }
  };

  return (
  <>

<Navbar expand="lg" className="bg-body-tertiary" style={{margin:'0px 200px'}}>
      <Container>
        <Navbar.Brand href="#home"><h1 style={{color:"green"}}><i className="bi bi-bag-dash-fill"></i>TĐS</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{margin:"20px 10px"}}>
          <h3 >Đăng Nhập</h3>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


    <div className="auth" style={{display:'flex',width:'100%'}}>
        <div className="left" >
            <h1 style={{textAlign:"center" , fontSize:"200px"}}><i className="bi bi-bag-dash-fill"></i></h1>
            <h2 style={{textAlign:"center" , fontSize:"80px"}}>TĐS</h2>
            <p style={{textAlign:"center" , fontSize:"20px"}}>Nền tảng thương mại điện tử</p>
            <p style={{textAlign:"center",fontSize:"20px"}}>Yêu Thích ở Đông Nam Á và Trung Quốc</p>
        </div>
        <div className="right" style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h3 style={{marginTop:'20px', textAlign:'center'}} >Đăng Nhập</h3>
      <Form style={{marginTop:"40px"}}>
      <Form.Group className="mb-3" >
        <Form.Control type="text" placeholder="Tên đăng nhập" value={username} onChange={(e)=>setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control type="password" placeholder="Mật khẩu" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <p style={{textAlign:"center" , color:'red'}}>{error}</p>
      <Button className="form-control" style={{background:"green"}} type="submit"onClick={handleSubmit} >ĐĂNG NHẬP</Button>
      </Form.Group>
    </Form>
    </div>
    </div>
  </>
  );
};

export default SignIn;
