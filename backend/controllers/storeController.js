const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} = require('../services/storeService');
const { sendSuccess } = require('../utils/apiResponse');

const listStores = async (req, res) => {
  const { search, sortBy, sortOrder } = req.query;
  const stores = await getAllStores({ search, sortBy, sortOrder });
  return sendSuccess(res, stores, 'Stores fetched');
};

const getStore = async (req, res) => {
  const store = await getStoreById(req.params.id);
  return sendSuccess(res, store, 'Store fetched');
};

const addStore = async (req, res) => {
  const store = await createStore(req.body);
  return sendSuccess(res, store, 'Store created', 201);
};

const editStore = async (req, res) => {
  const store = await updateStore(req.params.id, req.body);
  return sendSuccess(res, store, 'Store updated');
};

const removeStore = async (req, res) => {
  const result = await deleteStore(req.params.id);
  return sendSuccess(res, null, result.message);
};

module.exports = { listStores, getStore, addStore, editStore, removeStore };
