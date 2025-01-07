import React, { Component } from 'react';
// import axios from 'axios';

export class Test extends Component {
  
  apiCalling = async () => {
    // try {
    //   const token = '11422';
    //   const response = await axios.post('http://localhost:5500/items',{
    //     "title": "hh",
    //     "start_time": "2024-12-25 09:00:00",
    //     "end_time": "2025-12-25 09:00:00",
    //     "priority": 1,
    //     "task_status": "pending",
    //     "user_id": 1
    //   });

    //   // Log the response data
    //   console.log('API Response:', response);
    // } catch (error) {
    //   console.error('API Error:', error);
    // }
  };

  render() {
    return (
      <div>
        <button onClick={this.apiCalling}>apicalling</button>
      </div>
    );
  }
}

export default Test;
