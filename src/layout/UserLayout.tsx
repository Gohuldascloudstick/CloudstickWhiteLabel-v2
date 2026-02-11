import { Outlet } from "react-router-dom"
import Sidebar from "./component/Sidebar"
import { useState } from "react"
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";


const UserLayout = () => {
  const [menuOpen, setMenuopen] = useState(false);
  return (
    <div className="flex min-h-screen   justify-center w-full">
      {menuOpen && (
        <div className="fixed  inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/30 backdrop-brightness-50 transition-opacity"
            onClick={() => setMenuopen(false)}
          />
          <aside className="relative w-25   h-full  shadow-2xl border-r border-divider">
            <Sidebar />

          </aside>
        </div>
      )}

      <div className=" hidden lg:block w-25">
        <Sidebar />
      </div>
      <div className="relative bg-gray-50 flex flex-col w-full h-screen px-12 pt-12 pb-4">
        <Button
          isIconOnly
          className="bg-gray-50 absolute top-0 left-2 lg:hidden"
          onPress={() => setMenuopen(true)}>
          <Icon
            icon={"heroicons:bars-3"}
            className="text-gray-700 w-6 h-6"
          />
        </Button>
        <div className="flex flex-col justify-between flex-1 p-2 overflow-y-auto  scrollbar-hide">

          <Outlet />

          <footer className=" mt-12 w-full    flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className=" mt-1 md:mb-0">
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