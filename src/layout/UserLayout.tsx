import { Outlet } from "react-router-dom"
import Sidebar from "./component/Sidebar"


const UserLayout = () => {
  return (
    <div className="flex-1 flex justify-center min-h-screen bg-background text-foreground transition-colors">
      <div className="flex flex-1 overflow-hidden">


        <div className="hidden lg:flex w-25 border-r border-divider  h-full">
          <Sidebar />
        </div>
        <div className="flex-1 flex-col justify-center overflow-y-auto h-svh z-10 scrollbar-hide">
          <div className="h-auto w-full px-12 py-8 overflow-y-auto scrollbar-hide bg-gray-50">
            <Outlet />

          </div>
          <footer className="w-full bg-white border-t  border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 mt-1 md:mb-0">
              © {2025} -
              <span className="font-medium text-gray-700 mx-1">CloudStick LLC</span>
              - created by
              <a
                href="https://cloudstick.io"
                className="text-blue-600 hover:text-blue-800 ml-1 transition-colors"
              >
                CloudStick.io
              </a>
            </div>
            <nav className="flex mt-1 space-x-6">
              <a href="#dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </a>
              <a href="#license" className="text-blue-600 hover:underline">
                License
              </a>
              <a href="#changelog" className="text-gray-400 cursor-default">
                Changelog
              </a>
            </nav>
          </footer>

        </div>
      </div>


    </div>
  )
}

export default UserLayout