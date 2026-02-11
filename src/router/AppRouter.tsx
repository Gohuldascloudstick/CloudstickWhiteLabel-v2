import { Route, Routes } from "react-router-dom"
import UserLayout from "../layout/UserLayout"
import Dashboard from "../pages/Dashboard"
import Database from "../pages/Database/Database"
import Email from "../pages/Email/Email"
import Subdomain from "../pages/subdomain/Subdomain"
import Password from "../pages/Password/Password"
import WebSettings from "../pages/WebappSettings/WebSettings"
import CronJob from "../pages/Cron jobs/CronJob"
import AddCronJob from "../pages/Cron jobs/AddCronJob"
import Ssl from "../pages/Ssl/Ssl"
import EnableWebmail from "../pages/Email/EnableWebmail"


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="database" element={< Database />} />
                <Route path="email" element={<Email />} />
                <Route path="email/enablewebmail" element={<EnableWebmail />} />
                <Route path="subdomain" element={<Subdomain />} />
                <Route path="password" element={<Password />} />
                <Route path="websettings" element={<WebSettings />} />
                <Route path="cronjobs" element={<CronJob />} />
                <Route path="cronjobs/addcronjobs" element={<AddCronJob />} />
                <Route path="ssl" element={<Ssl />} />
            </Route>
        </Routes>
    )
}

export default AppRouter