import { useState,useEffect } from "react";
import Table from 'react-bootstrap/Table';
import useSWR from "swr";
import { Button } from 'react-bootstrap';
import CreateUser from "./create";
import UpdateUser from './update';
import DeleteUser from "./delete";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Menu from '../menu'
interface Iprops{
    users : Iuser[]
}
const UserEss=(props:Iprops)=>{
  
const { users } = props

const [user, setUser] = useState<Iuser | null>(null);
const [showcreate,setShowcreate] = useState<boolean>(false);
const [showupdate , setShowupdate] = useState<boolean>(false);
const [showdele , setShowdele] = useState<boolean>(false);
    return(
        <div>
          <Container>
            <Menu/>
            <div className="mb-3" style={{display:"flex", justifyContent:"space-between" ,paddingTop:"50px"}}>
        <h2>USER-LIST</h2>
        <Button variant="secondary" onClick={()=>{setShowcreate(true)}}>ADD NEW</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PASSWORD</th>
              <th>EMAIL</th>
              <th>checkAdmin</th>
              <th>NGÀY TẠO</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.password}</td>
                <td>{item.email}</td>
                <td>{item.checkAdmin?.toString()}</td>
                <td>{item.createdAt}</td>

                <td>
                 <Link className="btn btn-primary" href={`user/${item.id}`}>view</Link>
               
                <Button variant='warning' className="mx-3" onClick={()=>{
                  setUser(item)
                  setShowupdate(true);
                }}>Edit</Button>
                <Button variant='danger' onClick={()=>{
                    setUser(item)
                    setShowdele(true);
                }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CreateUser 
        showcreate={showcreate}
        setShowcreate={setShowcreate}
        />
        <UpdateUser
        showupdate={showupdate}
        setShowupdate={setShowupdate}
        user={user}
        setUser={setUser}
        />
      <DeleteUser 
      showdele={showdele}
      setShowdele={setShowdele}
      user={user}
      setUser={setUser}
      />
      </Container>
      </div>
    )
}
export default UserEss