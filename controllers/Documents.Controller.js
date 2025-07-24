import Document from '../models/Documents.Models.js';

export const createDocument = async (req, res) => {
  const doc = await Document.create({ ...req.body, ownerId: req.user._id });
  res.json(doc);
};

export const updateDocument = async (req, res) => {
  const { id } = req.params;
  const doc = await Document.findOneAndUpdate({ _id: id, ownerId: req.user._id }, req.body, { new: true });
  res.json(doc);
};

export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  await Document.findOneAndDelete({ _id: id, ownerId: req.user._id });
  res.json({ message: 'Deleted' });
};

export const getMyDocuments = async (req, res) => {
  const docs = await Document.find({ ownerId: req.user._id });
  res.json(docs);
};
