import React from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";

const Header = ()=>{
    const navgate = useNavigate();
    const signOutIng = ()=>{
        localStorage.removeItem('loginKey');
        window.location.reload();
    }
    const dashboardProcess = ()=>{
        console.log('h');
        navgate('/')
        
    }
    const taskListProcess = ()=>{

        console.log('ll');
        navgate('/tasklist')
        
    }
    return(
        <>
        <div className="header">
        <ul>
            <li>
                <span onClick={dashboardProcess}>Dashboard</span>
            </li>
            <li>
                <span onClick={taskListProcess}>Task List</span>
            </li>
        </ul>
        <div>
            <button onClick={signOutIng}>SignOut</button>
        </div>
        </div>
        </>
    )
}
export default Header