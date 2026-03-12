import { Button, Card, CardBody,Input } from "@heroui/react"
import { Icon } from "@iconify/react";
import { useState } from "react";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <Card className="max-w-212.5 w-full shadow-2xl overflow-hidden border-none" radius="none">
        <CardBody className="p-0 flex flex-col md:flex-row h-full md:h-125">

          {/* Left Side: Form Section */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Login</h1>

            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="Username"
                placeholder="Username"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                className="font-medium"
              />

              <Input
                label="Password"
                placeholder="Password"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                type={isVisible ? "text" : "password"}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    <Icon
                      icon={isVisible ? "solar:eye-closed-bold" : "solar:eye-bold"}
                      className="text-2xl text-default-400 pointer-events-none"
                    />
                  </button>
                }
              />

              <Input
                label="Domain"
                placeholder="Domain"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
              />

              <Button
                className="mt-4 bg-linear-to-br from-[#1d67a6] to-[#00bfa5] text-white font-bold text-md py-6"
                radius="sm"
                fullWidth
              >
                Login
              </Button>
            </form>
          </div>

          {/* Right Side: Visual Section */}
          <div className="hidden md:flex md:w-1/2 relative bg-white overflow-hidden">
            {/* The Blue Diagonal Background */}
            <div
              className="absolute inset-0 bg-linear-to-br from-[#1d67a6] via-[#1d67a6] to-[#00bfa5] z-10"
              style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            />

            
            

            {/* Content Over the Blue Section */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full p-12 text-center text-white">
              <div className="mb-6 w-28 h-28">
                {/* Modern alternative image for the logo */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3665/3665923.png"
                  alt="Logo"
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <p className="text-lg font-semibold leading-snug max-w-70">
                Seamlessly manage and access your web app through this intuitive control panel.
              </p>
            </div>
          </div>

        </CardBody>
      </Card>
    </div>
  )
}

export default Login