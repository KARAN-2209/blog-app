import React, { useEffect, useState } from "react";
import API from "../services/api";

function Creator() {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await API.get("/api/users/admins");
        setAdmin(data?.admins || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Popular Creators</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5">
        {admin?.length > 0 ? (
          admin.slice(0, 4).map((element) => (
            <div key={element._id} className="text-center">
              <img
                src={element?.photo?.url || "/default.png"}
                alt="creator"
                className="w-40 h-40 object-cover border rounded-full mx-auto"
              />
              <p>{element?.name}</p>
              <p className="text-gray-600 text-xs">{element?.role}</p>
            </div>
          ))
        ) : (
          <p>No creators available</p>
        )}
      </div>
    </div>
  );
}

export default Creator;