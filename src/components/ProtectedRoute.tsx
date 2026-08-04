import type { ReactNode ,  } from "react";
import { Navigate } from "react-router";


export default function ProtectedRoute({children}: {children: ReactNode}) {
  return (
    localStorage.getItem('accessToken') ? children : <Navigate to="/login" ></Navigate>
  )
}
