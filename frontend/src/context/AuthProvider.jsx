import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api"; // ✅ use central API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]); // ✅ safe default
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");

        if (!token) return;

        const { data } = await API.get("/api/users/my-profile");

        setProfile(data?.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);

        // ✅ if token invalid → force logout
        localStorage.removeItem("jwt");
        setProfile(null);
        setIsAuthenticated(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const { data } = await API.get("/api/blogs/all-blogs");

        setBlogs(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchBlogs();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);