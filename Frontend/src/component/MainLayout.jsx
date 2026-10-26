import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import AssistantWidget from './AssistantWidget'

const MainLayout = () => {
  return (
    <div className="app-shell">
        <Navbar/>
        <div className="pt-16 sm:pt-[4.5rem]">
            <Outlet/>
        </div>
        <AssistantWidget />
    </div>
  )
}

export default MainLayout
