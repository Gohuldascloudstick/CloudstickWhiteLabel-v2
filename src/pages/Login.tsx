import { Button, Card, CardBody, Input } from "@heroui/react"
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { login } from "../redux/slice/authSlice";
import { useAppDispatch } from "../redux/hook";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

// Helper to determine text color (black or white) based on background hex
const getContrastColor = (hexcolor?: string) => {
  if (!hexcolor) return 'white';
  let hex = hexcolor.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#111827' : 'white';
};

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { businessDetails, loading, error } = useSelector((state: RootState) => state.auth);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ system_user_name: username, password }));
    if (login.fulfilled.match(resultAction)) {
      // Handle navigation or success state here
      navigate('/')
      console.log("Login successful");
    }
  };

  const buttonTextColor = getContrastColor(businessDetails?.theme_color);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 relative overflow-hidden">

      {/* Decorative Background Elements (Optional, extremely subtle) */}
      <div className="absolute top-[-20%] right-[-10%] w-200 h-200 rounded-full bg-primary/5 blur-3xl pointer-events-none transition-colors duration-1000"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-150 h-150 rounded-full bg-primary/5 blur-3xl pointer-events-none transition-colors duration-1000"></div>

      <div className="w-full max-w-md z-10">
        <Card className="w-full shadow-2xl p-2 md:p-4 bg-white border-none" radius="lg">
          <CardBody className="p-8 flex flex-col gap-6">

            {/* Logo Section */}
            <div className="flex flex-col items-center text-center justify-center gap-4 mb-2">
              {businessDetails?.primary_logo ? (
                <img
                  src={businessDetails.primary_logo}
                  alt="Logo"
                  className="h-16 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary/30">
                    {businessDetails?.brand_name?.charAt(0) || "C"}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 wrap-break-word">
                {businessDetails?.brand_name ? `Welcome to ${businessDetails.brand_name}` : "Welcome back"}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Seamlessly manage and access your web app through this intuitive control panel.
              </p>
            </div>

            <form className="flex flex-col gap-5 w-full" onSubmit={handleLogin}>
              <Input
                label="Username"
                placeholder="Enter your username"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                className="font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    <Icon
                      icon={isVisible ? "solar:eye-closed-bold" : "solar:eye-bold"}
                      className="text-2xl text-default-400 pointer-events-none"
                    />
                  </button>
                }
              />

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-100">{error}</p>}

              <Button
                className="text-md py-6 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform"
                radius="sm"
                fullWidth
                type="submit"
                isLoading={loading}
                style={{
                  backgroundColor: `var(--primary-color)`,
                  color: buttonTextColor,
                  fontWeight: 'bold'
                }}
              >
                Sign In
              </Button>
            </form>

          </CardBody>
        </Card>
      </div>



    </div>
  )
}

export default Login