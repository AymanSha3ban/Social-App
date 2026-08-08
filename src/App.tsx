import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import PostDetails from './pages/PostDetails'
import { AuthContext } from './context/createdContext/AuthContext'
import { useContext } from 'react'



export default function App() {
  const { isAuthed } = useContext(AuthContext)!;

  const routes = createBrowserRouter([
    {path : '/' , element : <Layout></Layout> , children:[
      {index : true , element : isAuthed ? <Home></Home> : <Login></Login>} ,
      {path : 'register' , element : <Register></Register>},
      {path : 'home' , element : <ProtectedRoute><Home></Home></ProtectedRoute>},
      {path : 'posts/:id' , element : <ProtectedRoute><PostDetails></PostDetails></ProtectedRoute>},
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

