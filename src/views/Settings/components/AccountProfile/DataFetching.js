import React, { useState, useEffect } from 'react'
import axios from 'axios'

function DataFetching() {
    const [profiles, setProfiles] = ([])
    useEffect(() => {
        axios.get('http://192.168.0.24:8761/api/login-service/v1/user/admin', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNTkyNzIzOTIxLCJleHAiOjE1OTMzMjg3MjF9.ph1ZZPN5uIuTeCyJl13K3s9pnUFpL5UiRitewKNa0AEmZCNVzRXw7sPIKchlJxnY8gC41CSewtLYKpNxe6ITqg'
            }
        })
            .then(res => {
                console.log(res)
                // setProfiles(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    })
    return (
        <div>
        </div>
    )
}

export default DataFetching
