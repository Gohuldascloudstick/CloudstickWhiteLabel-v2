import { Route, Routes } from "react-router-dom"
import UserLayout from "../layout/UserLayout"
import Dashboard from "../pages/Dashboard"
import Database from "../pages/Database/Database"
import Email from "../pages/Email/Email"
import Subdomain from "../pages/subdomain/Subdomain"
import Password from "../pages/Password/Password"


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="database" element={< Database />} />
                <Route path="email" element={<Email />} />
                <Route path="subdomain" element={<Subdomain />} />
                <Route path="password" element={<Password/>} />
            </Route>
        </Routes>
    )
}

export default AppRouter