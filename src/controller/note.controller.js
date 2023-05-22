const { createResponseData } = require("../utils/response");
const { noteService } = require("../services");
const httpStatus = require("http-status");
const constant = require("../utils/constants");
const { catchAsync } = require("../utils/catchAsync");

const createNote = catchAsync(async (req, res) => {
  let { userId, title, description, status, date } = req.body;
  userId = req.userData.userId;
  date = new Date();
  const data = { userId, title, description, status, date };

  await noteService.createTask(data);

  return createResponseData(
    res,
    {},
    httpStatus.OK,
    false,
    constant.TASK_CREATED
  );
});

const getNotes = catchAsync(async (req, res) => {
  const userId = req.userData.userId;

  const getAllNotes = await noteService.getNotesData(
    {
      userId: userId,
      status: { $ne: "deleted" },
    },
    {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  );

  return createResponseData(res, { getAllNotes }, httpStatus.OK, false, {});
});

const getNote = catchAsync(async (req, res) => {
  const id = req.params.id;

  const getParticularNote = await noteService.getNotesData(
    {
      _id: id,
      status: { $ne: "deleted" },
    },
    {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  );

  return createResponseData(
    res,
    { getParticularNote },
    httpStatus.OK,
    false,
    {}
  );
});

const editNote = catchAsync(async (req, res) => {
  const id = req.params.id;

  const updateNote = await noteService.updateNotesData(id, req.body);

  return createResponseData(
    res,
    {},
    httpStatus.OK,
    false,
    constant.NOTE_UPDATED_SUCCESSFULLY
  );
});

const deleteNote = catchAsync(async (req, res) => {
  const id = req.params.id;

  const deleteNote = await noteService.updateNotesData(id, {
    status: "deleted",
  });

  return createResponseData(
    res,
    {},
    httpStatus.OK,
    false,
    constant.NOTE_DELETED_SUCCESSFULLY
  );
});

const getDetails = catchAsync(async (req, res) => {});

module.exports = {
  createNote,
  getNotes,
  getNote,
  editNote,
  deleteNote,
  getDetails,
};
