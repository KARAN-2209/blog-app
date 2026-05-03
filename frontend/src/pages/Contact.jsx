import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      access_key: import.meta.env.VITE_ACCESS_KEY,
      name: data.username,
      email: data.email,
      message: data.message,
    };

    try {
      const response = await axios.post(
        "https://api.web3forms.com/submit",
        userInfo
      );

      if (response.data.success) {
        toast.success("Message sent successfully");
        reset();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-2 text-gray-600">
            Send us your message and we’ll get back to you soon.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span className="text-sm text-red-500 font-semibold">
                Name is required
              </span>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500 font-semibold">
                Email is required
              </span>
            )}
          </div>

          <div>
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("message", { required: true })}
            />
            {errors.message && (
              <span className="text-sm text-red-500 font-semibold">
                Message is required
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-yellow-600 duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
