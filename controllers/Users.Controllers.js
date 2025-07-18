import userModel from "../models/Users.Models.js";

// Lấy thông tin cá nhân
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error: err.message });
  }
};

// Cập nhật thông tin cá nhân
const updateUser = async (req, res) => {
  try {
    const updated = await userModel.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");

    res.status(200).json({ message: "Cập nhật thông tin thành công", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin", error: err.message });
  }
};

const userController = {
  getUser,
  updateUser,
};

export default userController;
