import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Image is required" });
    }

    const { blogImage } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Only jpg, png, webp allowed",
      });
    }

    const { title, category, about } = req.body;
    if (!title || !category || !about) {
      return res.status(400).json({
        message: "title, category & about are required",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );

    const blog = await Blog.create({
      title,
      category,
      about,
      adminName: req.user.name,
      adminPhoto: req.user.photo?.url,
      createdBy: req.user._id,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog id" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ delete image from cloudinary
    if (blog.blogImage?.public_id) {
      await cloudinary.uploader.destroy(blog.blogImage.public_id);
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting blog" });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= GET SINGLE BLOG ================= */
export const getSingleBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog id" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
};

/* ================= MY BLOGS ================= */
export const getMyBlogs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myBlogs = await Blog.find({ createdBy: req.user._id });

    res.status(200).json(myBlogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your blogs" });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog id" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let updateData = {
      title: req.body.title,
      category: req.body.category,
      about: req.body.about,
    };

    // ✅ HANDLE IMAGE UPDATE
    if (req.files && req.files.blogImage) {
      const file = req.files.blogImage;

      // delete old image
      if (blog.blogImage?.public_id) {
        await cloudinary.uploader.destroy(blog.blogImage.public_id);
      }

      const result = await cloudinary.uploader.upload(file.tempFilePath);

      updateData.blogImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating blog" });
  }
};