import React from 'react'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div>
      home layout
    <Outlet />
    </div>
  )
}

export default AppLayout
