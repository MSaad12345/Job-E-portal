// src/components/AuthForm.jsx
import { useContext, useState } from "react";
import { motion,AnimatePresence} from "framer-motion";
import api from '../Api'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function AuthForm() {
  const [formType, setFormType] = useState("login"); // "login" | "signup" | "forgot"
  const [name,setname] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setmessage] = useState("");
  const navigate = useNavigate();

   const {login} = useContext(AppContext)


  const Signup = async()=>{
       try {
        const res = await api.post("/Signup",{name,email,password},{ withCredentials: true })
           const token = res.data.token;
      if (token) {
        login(token,res.data.user); 
      }
          setmessage(res.data.message || "Signup successful ✅");
           if (res.data.redirectUrl) {
      navigate(res.data.redirectUrl);
           }
       } catch (error) {
        console.error(error);
      setmessage( "Signup failed ❌");
       }
  }
    
   const Login = async()=>{
       try {
        const res = await api.post("/Login",{email,password},{ withCredentials: true })
             const token = res.data.token;

        if (token) {
        login(token,res.data.user); // 👈 context update karo
      }
          setmessage(res.data.message || "Login successful ✅");
          if (res.data.redirectUrl) {
      navigate(res.data.redirectUrl);
    }
       } catch (error) {
        console.error(error);
      setmessage( "Login failed ❌");
       }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "login") {
       Login()
    } else if (formType === "signup") {
      Signup()
    } else {
      alert(`Password reset link sent to ${email}`);
    }
  };

  // Animations
  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.95 },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={formType}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
              {formType === "login"
                ? "Welcome Back 👋"
                : formType === "signup"
                ? "Create Account 🚀"
                : "Reset Password 🔑"}
            </h2>
            <div className="text-center">  {message}</div>           
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === "signup"?  <motion.div
                custom={0}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-gray-700 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter your Name"
                />
              </motion.div> : null}
              <motion.div
                custom={0}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter your email"
                />
              </motion.div>

              {formType !== "forgot" && (
                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-gray-700 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter your password"
                  />
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                {formType === "login"
                  ? "Login"
                  : formType === "signup"
                  ? "Sign Up"
                  : "Send Reset Link"}
              </motion.button>
            </form>

            {/* Links */}
            <div className="text-center mt-6 text-sm text-gray-600 space-y-2">
              {formType === "login" && (
                <>
                  <p>
                    Don’t have an account?{" "}
                    <button
                      className="text-indigo-600 hover:underline font-semibold"
                      onClick={() => setFormType("signup")}
                    >
                      Sign Up
                    </button>
                  </p>
                  <p>
                    Forgot password?{" "}
                    <button
                      className="text-indigo-600 hover:underline font-semibold"
                      onClick={() =>navigate("/sendotp")}
                    >
                      Reset
                    </button>
                  </p>
                </>
              )}

              {formType === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button
                    className="text-indigo-600 hover:underline font-semibold"
                    onClick={() => setFormType("login")}
                  >
                    Login
                  </button>
                </p>
              )}

              {formType === "forgot" && (
                <p>
                  Remember your password?{" "}
                  <button
                    className="text-indigo-600 hover:underline font-semibold"
                    onClick={() => setFormType("login")}
                  >
                    Back to Login
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
