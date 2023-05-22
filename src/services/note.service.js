const { note } = require("../models");

const createTask = async (noteData) => {
  const task = new note(noteData);
  return await task.save();
};

const getNotesData = async (data, projection) => {
  return await note.find(data, projection);
};

const updateNotesData = async (id, updateData) => {
  // console.log(id, updateData);
  return await note.findByIdAndUpdate({ _id: id }, { $set: updateData });
};

const deleteNote = async (id, deleteData) => {
  return await note.findByIdAndUpdate();
};

module.exports = {
  createTask,
  getNotesData,
  updateNotesData,
  deleteNote,
};
