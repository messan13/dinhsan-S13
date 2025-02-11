import { getSession } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer} from 'react-toastify';
import { SessionProvider } from "next-auth/react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
  
      <SessionProvider session={pageProps.session}>  
  <Component {...pageProps} />
  </SessionProvider> 
  
  <ToastContainer 
  position="top-right"
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


  </div>
  )
}
