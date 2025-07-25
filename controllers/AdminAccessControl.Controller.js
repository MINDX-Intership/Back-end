import AccessControl from '../models/AdminAccessControl.Models.js';
import userModel from '../models/Users.Models.js';

// Cấp quyền
export const grantAccess = async (req, res) => {
  try {
    const { userId, roles } = req.body;

    let access = await AccessControl.findOne({ userId });
    if (access) {
      return res.status(400).json({ message: 'User already has access. Use update instead.' });
    }

    access = await AccessControl.create({ userId, roles });
    res.status(201).json({ message: 'Access granted successfully', access });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Chỉnh sửa quyền
export const updateAccess = async (req, res) => {
  try {
    const { userId, roles } = req.body;

    const access = await AccessControl.findOneAndUpdate(
      { userId },
      { roles },
      { new: true }
    );

    if (!access) return res.status(404).json({ message: 'Access not found' });

    res.status(200).json({ message: 'Access updated successfully', access });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa quyền
export const deleteAccess = async (req, res) => {
  try {
    const { userId } = req.params;

    const access = await AccessControl.findOneAndDelete({ userId });

    if (!access) return res.status(404).json({ message: 'Access not found' });

    res.status(200).json({ message: 'Access removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
