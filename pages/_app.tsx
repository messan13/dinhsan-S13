import { getSession } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer} from 'react-toastify';
import { SessionProvider } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Menu from "./user/menu";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
  
  <SessionProvider session={pageProps.session}>  
  <Menu />
  <Component {...pageProps} />
  <ToastContainer 
  position="top-center"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick={false}
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  />

</SessionProvider> 
  </>
  )
}
