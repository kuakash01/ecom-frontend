import React from 'react'
import { Outlet } from 'react-router-dom'

function AppLayoutAdmin() {
  return (
    <div>
      <h1>app layout admin</h1>
      <Outlet />
    </div>
  )
}

export default AppLayoutAdmin
