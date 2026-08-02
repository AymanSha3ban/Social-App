import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'



export default function App() {

  const routes = createBrowserRouter([
    {path : '/' , element : <Layout></Layout> , children:[
      {index : true , element : <Login></Login>} ,
      {path : 'register' , element : <Register></Register>},
      {path : 'home' , element : <Home></Home>},
      {path : 'login' , element : <Login></Login>},
      {path : '*' , element : <NotFound></NotFound>},
    ]}
  ])

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

