import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";

const DashBoard = ()=>{
    const [products,setProducts] = useState([]);
    // const [tasks,setTasks] = useState(false);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    
    const [totalTask,setTotalTask] = useState(0);
    const [totalPendingTask,setTotalPendingTask] = useState(0);
    const [totalFinishesTask,setTotalFinishesTask] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('loginKey'));
    // const token = localStorage.getItem('loginKey');

    useEffect(()=>{
        if (!token) {
            console.error("User not authenticated");
            return;
          }
        const prodectData = async ()=>{
            
            try {
             const result = await axios.get(baseUrl+'/api/items',{
                headers: {
                    'Authorization': `Bearer ${token}`, 
                  }
            });
             console.log('rees',result.data);
             setProducts(result.data);
            //  setTasks(true);
             for (let index = 0; index < result.data.length; index++) {
                if (result.data[index].countSummery) {
                    
                    setTotalTask(result.data[index].countSummery.totalTask);
                    setTotalPendingTask(result.data[index].countSummery.totalPendingTask);
                    setTotalFinishesTask(result.data[index].countSummery.totalFinishedTask);
                }
                
             }
             
            } catch (error) {
             console.error('ApiError',error)
            }
         }
         prodectData();
    },[]);
    const priorityListTotal =()=>{
        const totals = products.filter(item => item?.PrioritySummery);
        console.log(totals);
        
        
    }
    const priorityList = useMemo(() => [
        
        { priority: 1, pendingTasks: products[products.length-2]?.PrioritySummery?.totalPriorityOne},
        { priority: 2, pendingTasks: products[products.length-2]?.PrioritySummery?.totalPriorityTwo},
        { priority: 3, pendingTasks: products[products.length-2]?.PrioritySummery?.totalPriorityThree},
        { priority: 4, pendingTasks: products[products.length-2]?.PrioritySummery?.totalPriorityFour},
        { priority: 5, pendingTasks: products[products.length-2]?.PrioritySummery?.totalPriorityFive},
      ], [priorityListTotal]);

    return (
        <>
        <Header />
        <div className="title"><h1> <span className="dash">Dash</span><span className="board">board</span></h1></div>
       <div className="dashboard-firstpart">
        <h5>Summary</h5>
        <div className="card-container">
                <Card title={totalTask}>
                        <p className="m-0">
                        Total Task
                        </p>
                    </Card>
                    <Card title={totalFinishesTask}>
                        <p className="m-0">
                            Tasks Completed
                        </p>
                    </Card>
                    <Card title={totalPendingTask}>
                        <p className="m-0">
                            Tasks Pending
                        </p>
                    </Card>
                    {/* <Card title="25%">
                        <p className="m-0">
                            Average time per task completed
                        </p>
                    </Card> */}
        </div>
        <h5>pendingtask summery</h5>
        <div className="card-container">
                <Card title={totalPendingTask}>
                        <p className="m-0">
                        Pending task
                        </p>
                    </Card>
                    {/* <Card title="25%">
                        <p className="m-0">
                            a ratione quam perferendis
                        </p>
                    </Card>
                    <Card title="25%">
                        <p className="m-0">
                            culpa ratione quam pe
                        </p>
                    </Card>
                    <Card title="25%">
                        <p className="m-0">
                            Total Task
                        </p>
                    </Card> */}
        </div>
       </div>
       <div className="card dashboard-table">
        <DataTable value={priorityList} showGridlines tableStyle={{ minWidth: '50rem' }}>
            <Column field="priority" header="Task Priority"></Column>
            <Column field="pendingTasks" header="Pending Task"></Column>
            {/* <Column field="timeSlaping.hours" header="Time Lapsed (hrs)"></Column>
            <Column field="totalTime.hours" header="Time To Finish (hrs)"></Column> */}
        </DataTable> 
       </div>
        </>
    )
}
export default DashBoard