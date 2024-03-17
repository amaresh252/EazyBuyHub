import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import {  } from "../authSlice";
import { Navigate } from "react-router-dom";
import { signOutAsync,selectLoggedInUser } from "../authSlice";

function Logout(){
    const dispatch=useDispatch();
    const user=useSelector(selectLoggedInUser)
    useEffect(()=>{
        dispatch(signOutAsync())
    })
    return <>  { !user && <Navigate to='/login' replace={true} ></Navigate>}  </>;
}

export  default Logout;