import { createContext, use } from "react";
import axios from "axios";
import useUserStore from "./zustand";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const base_url = "http://localhost:5000";//TODO:Change with backend url

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const ec = useUserStore((state) => state.user);
  const setEc = useUserStore((state) => state.setUser);

  const LoginVolunteer = async (data) => {    
    try {
      const responce = await axios.post(`${base_url}/loginVolunteer`, {
        ...data
      });
      if (responce.status === 200) {
        setUser({ role:'voter' , ...responce.data});
        toast.success(`Login Success`);
        navigate("/dashboard");
      }
      else {
        toast.error(`Login Failed`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Login Failed ${error}`);

    }
  }

  const LoginEcMember = async (data) => {
    try {
      const responce = await axios.post(`${base_url}/loginEcmember`, {
        ...data
      });
      if (responce.status === 200) {
        setUser({ role:'ec' , ...responce.data});
        navigate("/dashboard");
      }
      else {
        toast.error(`Login Failed`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Login Failed ${error}`);
    }
  }

  const RegisterVoter = async (data) => {
    try {
      const responce = await axios.post(`${base_url}/registerVoter`, {
        ...data, id: user._id
      });
      if (responce.status === 200) {
        setUser(responce.data);
        navigate("/");
      }
      else {
        toast.error(`Voter Registration Failed`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Voter Registration Failed ${error}`);
    }
  }

  const GetStudentDetail = async () => {
    try {
        const response = await axios.get(`${base_url}/getStudentDetail/${voterId}`);
        if (response.status === 200) {
          if(user.role === "volunteer"){
            navigate("/add-voter", { state: { voterInfo:response.data } });
          }
          else if(user.role === "ec"){
            navigate("/verify-voter", { state: { voterInfo:response.data } });
          }
        } else {
            toast.error("Student Detail Fetch Failed");
        }
    } catch (error) {
        console.log(error);
        toast.error("Student Detail Fetch Failed");
    }
};

  const contextData = {
    LoginVolunteer,
    LoginEcMember,
    user,
    RegisterVoter,
    ec,
    GetStudentDetail
}


  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}