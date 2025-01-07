import axios from "axios";
import React, {  useState } from "react";

const Login = ()=>{
    const [login,setLogIn] = useState(true);
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const handelingEmail=(e)=>{
        setEmail(e.target.value);
        
    }
    const handelingPassword = (e)=>{
        setPassword(e.target.value)
    }
    const creatAcc = ()=>{
        setLogIn(false)
    }
    const sighinProcess = async ()=>{
        const signinCall = await axios.post(baseUrl+'/auth/register',{
            email:email,
            password: password
        })
        console.log('res',signinCall.data.message);
        setLogIn(true)
        
    }
    const loginProcess = async ()=>{
        try {
            const loginCall = await axios.post(baseUrl+'/auth/login', {
              email,
              password,
            });
            console.log('loginCall',loginCall);
            
            localStorage.setItem('loginKey', loginCall.data.token);
            localStorage.setItem('userid', loginCall.data.id);
            console.log('Token:', loginCall.data.token);
            window.location.reload();
          } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            alert('Login failed. Please check your credentials.');
          }

    }
    return(
        <>
        <div>
           <div className="flex flex-column	gap-2	">
            <h2>Wellcome to To-do app</h2>
            <div>
            <input placeholder="Email" className="border-1	py-2 px-2 w-2 px-1 border-round-sm" value={email} onChange={handelingEmail} type="text" />
            </div>
           <div>
           <input placeholder="Password" className="border-1	py-2 px-2 w-2 px-1 border-round-sm" value={password} onChange={handelingPassword} type="text" />
           </div>
          </div>
           {login ? <button className="border-1	py-2 px-8 mt-2 log-sign	px-1 border-round-sm" onClick={loginProcess}> LogIn</button>: <button className="border-1	py-2 px-8 mt-2 log-sign	px-1 border-round-sm" onClick={sighinProcess}> SignUp</button>}
           <p onClick={creatAcc}>Create an account</p>
        </div>
        </>
    )
}
export default Login