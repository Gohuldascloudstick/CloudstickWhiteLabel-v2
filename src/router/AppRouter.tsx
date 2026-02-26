import { Route, Routes } from "react-router-dom"
import UserLayout from "../layout/UserLayout"
import Dashboard from "../pages/Dashboard"
import Database from "../pages/Database/Database"
import Email from "../pages/Email/Email"
import Subdomain from "../pages/subdomain/Subdomain"
import Password from "../pages/Password/Password"
import WebSettings from "../pages/WebappSettings/WebSettings"
import AddCronJob from "../pages/Cron jobs/AddCronJob"
import Ssl from "../pages/Ssl/Ssl"
import EnableWebmail from "../pages/Email/EnableWebmail"
import Cronjob from "../pages/Cron jobs/CronJob"
import EmailAuthentication from "../pages/Email/EmailAuthentication"
import Filemanager from "../pages/Filemanager/Filemanager"
import Serverlogs from "../pages/ServerLogs/Serverlogs"
import Git from "../pages/Git/Git"
import Wordpress from "../pages/Wordpress/Wordpress"
import Login from "../pages/Login"



const AppRouter = () => {
    return (
        <Routes>
            <Route path="login" element={<Login/>} />
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="database" element={< Database />} />
                <Route path="email" element={<Email />} />
                <Route path="email/emailauthentication" element={<EmailAuthentication />} />
                <Route path="email/enablewebmail" element={<EnableWebmail />} />
                <Route path="subdomain" element={<Subdomain />} />
                <Route path="password" element={<Password />} />
                <Route path="websettings" element={<WebSettings />} />
                <Route path="cronjobs" element={<Cronjob />} />
                <Route path="cronjobs/addcronjobs" element={<AddCronJob />} />
                <Route path="ssl" element={<Ssl />} />
                <Route path="file" element={<Filemanager />} />
                <Route path="logs" element={<Serverlogs />} />
                <Route path="git" element={<Git />} />
                <Route path="wordpress" element={<Wordpress />} />
                
            </Route>
        </Routes>
    )
}

export default AppRouter