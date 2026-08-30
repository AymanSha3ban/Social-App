import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import PostDetails from './pages/PostDetails'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast';
import StoriesRoom from './components/Story/StoriesRoom'
import { useAuthStore } from './Stores/useAuthStore'

export default function App() {

  const user= useAuthStore(state=>state.user);

  const routes = createBrowserRouter([
    {path : '/' , element : <Layout></Layout> , children:[
      {index : true , element : user ? <Home></Home> : <Login></Login>} ,
      {path : 'register' , element : <Register></Register>},
      {path : 'home' , element : <ProtectedRoute><Home></Home></ProtectedRoute>},
      {path : 'posts/:id' , element : <ProtectedRoute><PostDetails></PostDetails></ProtectedRoute>},
      {path : 'story/:id' , element : <ProtectedRoute><StoriesRoom></StoriesRoom></ProtectedRoute>},
      {path : 'profile' , element : <ProtectedRoute><Profile></Profile></ProtectedRoute>},
      {path : 'login' , element : <Login></Login>},
      {path : '*' , element : <NotFound></NotFound>},
    ]}
  ])

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

