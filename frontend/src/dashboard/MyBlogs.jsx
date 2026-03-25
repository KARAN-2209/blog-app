import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import API from "../services/api";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await API.get("/api/blogs/my-blog");
        setMyBlogs(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/api/blogs/delete/${id}`);

      toast.success(res.data.message || "Blog deleted successfully");

      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete blog"
      );
    }
  };

  return (
    <div className="container mx-auto my-12 p-4">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-20">
        {myBlogs?.length > 0 ? (
          myBlogs.map((element) => (
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              key={element._id}
            >
              {element?.blogImage && (
                <img
                  src={element?.blogImage.url}
                  alt="blogImg"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <span className="text-sm text-gray-600">
                  {element.category}
                </span>

                <h4 className="text-xl font-semibold my-2">
                  {element.title}
                </h4>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/blog/update/${element._id}`}
                    className="text-blue-500 px-3 py-1 border rounded-md"
                  >
                    UPDATE
                  </Link>

                  <button
                    onClick={() => handleDelete(element._id)}
                    className="text-red-500 px-3 py-1 border rounded-md"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            You have not posted any blog to see!
          </p>
        )}
      </div>
    </div>
  );
}

export default MyBlogs;