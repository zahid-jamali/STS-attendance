import { useEffect, useState } from "react";

const ManageComplains=()=>{
    const [records, setRecords]=useState([]);

    const getComplains=async()=>{
        let req=await fetch(`${process.env.REACT_APP_API_URLS}/get-all-complains`);
        if(req.ok){
            let data=await req.json();
            setRecords(data);
        }
    }
    useEffect(()=>{
        getComplains();
    }, [])
    return(
        <>
            <h2>Manage Complains and Suggestions here</h2>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                
            </table>

        </>
    )
}

export default ManageComplains;