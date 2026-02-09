import { Route, Routes } from "react-router-dom"
import UserLayout from "../layout/UserLayout"
import Dashboard from "../pages/Dashboard"
import Database from "../pages/Database"
import Email from "../pages/Email"


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="database" element={< Database/>}/>
                <Route path="email" element={<Email/>} />
            </Route>
        </Routes>
    )
}

export default AppRouter