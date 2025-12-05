import {
  createCartItemAPI,
  createFavorite,
  deleteCartItem as apiDeleteCartItem,
  deleteFavorite,
  fetchCartItems as apiFetchCartItems,
  fetchFavorites,
  updateCartItemAPI,
} from "../utils/api";

export const SET_CURRENT_USER = "auth/SET_CURRENT_USER";
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const FAV_REQUEST = "favorites/REQUEST";
export const FAV_FAILURE = "favorites/FAILURE";
export const FAV_SET = "favorites/SET";
export const FAV_ADD = "favorites/ADD";
export const FAV_REMOVE = "favorites/REMOVE";

const favRequest = () => ({ type: FAV_REQUEST });
const favFailure = (error) => ({ type: FAV_FAILURE, error });
const favSet = (items) => ({ type: FAV_SET, payload: items });
const favAdd = (item) => ({ type: FAV_ADD, payload: item });
const favRemove = (id) => ({ type: FAV_REMOVE, payload: id });

export const loadFavorites = (userId) => async (dispatch) => {
  if (!userId) return;
  dispatch(favRequest());
  try {
    const list = await fetchFavorites({ user_id: userId });
    dispatch(favSet(Array.isArray(list) ? list : []));
  } catch (e) {
    console.error(e);
    dispatch(favFailure(e.message || "Failed to load favorites"));
  }
};

export const addToFavorites =
  ({ userId, productId }) =>
  async (dispatch) => {
    if (!userId || !productId) return;
    dispatch(favRequest());
    try {
      const created = await createFavorite({
        user_id: userId,
        product_id: productId,
      });
      dispatch(favAdd(created));
    } catch (e) {
      console.error(e);
      dispatch(favFailure(e.message || "Failed to add to favorites"));
    }
  };

export const removeFromFavorites =
  ({ favoriteId }) =>
  async (dispatch) => {
    if (!favoriteId) return;
    dispatch(favRequest());
    try {
      await deleteFavorite(favoriteId);
      dispatch(favRemove(favoriteId));
    } catch (e) {
      console.error(e);
      dispatch(favFailure(e.message || "Failed to remove from favorites"));
    }
  };

export const CART_REQUEST = "cart/REQUEST";
export const CART_FAILURE = "cart/FAILURE";
export const CART_SET = "cart/SET";
export const CART_ADD = "cart/ADD";
export const CART_REMOVE = "cart/REMOVE";
export const CART_UPDATE = "cart/UPDATE";
export const CART_CLEAR = "cart/CLEAR";
export const cartClear = () => ({ type: CART_CLEAR });
export const clearCart = () => (dispatch) => {
  dispatch(cartClear());
};

const cartRequest = () => ({ type: CART_REQUEST });
const cartFailure = (error) => ({ type: CART_FAILURE, error });
const cartSet = (items) => ({ type: CART_SET, payload: items });
const cartAdd = (item) => ({ type: CART_ADD, payload: item });
const cartRemove = (id) => ({ type: CART_REMOVE, payload: id });
const cartUpdate = (item) => ({ type: CART_UPDATE, payload: item });

export const loadCart = (userId) => async (dispatch) => {
  if (!userId) return;
  dispatch(cartRequest());
  try {
    const list = await apiFetchCartItems({ user_id: userId });
    dispatch(cartSet(Array.isArray(list) ? list : []));
  } catch (e) {
    console.error(e);
    dispatch(cartFailure(e.message || "Failed to load cart"));
  }
};

export const addToCart =
  ({ userId, productId, quantity = 1, options = {} }) =>
  async (dispatch, getState) => {
    if (!userId || !productId) return;

    const state = getState();

    const existing = state.cart.items.find((it) => {
      return (
        it.product_id === productId &&
        it.engine_id === options.engineId &&
        it.color_id === options.colorId &&
        it.trim_id === options.trimId
      );
    });

    dispatch(cartRequest());

    try {
      if (existing) {
        const newQty = (existing.quantity || 1) + quantity;
        const updated = await updateCartItemAPI(existing.id, {
          quantity: newQty,
        });
        dispatch(cartUpdate(updated));
      } else {
        const payload = {
          user_id: userId,
          product_id: productId,
          quantity,
          engine_id: options.engineId,
          color_id: options.colorId,
          trim_id: options.trimId,
        };
        const created = await createCartItemAPI(payload);
        dispatch(cartAdd(created));
      }
    } catch (e) {
      console.error(e);
      dispatch(cartFailure(e.message || "Failed to add to cart"));
    }
  };

export const removeFromCart =
  ({ cartItemId }) =>
  async (dispatch) => {
    if (!cartItemId) return;

    dispatch(cartRequest());

    try {
      await apiDeleteCartItem(cartItemId);
      dispatch(cartRemove(cartItemId));
    } catch (e) {
      console.error(e);
      dispatch(cartFailure(e.message || "Failed to remove from cart"));
    }
  };

export const updateCartQuantity =
  ({ cartItemId, quantity }) =>
  async (dispatch) => {
    if (!cartItemId || typeof quantity !== "number") return;
    dispatch(cartRequest());
    try {
      const updated = await updateCartItemAPI(cartItemId, { quantity });
      dispatch(cartUpdate(updated));
    } catch (e) {
      console.error(e);
      dispatch(cartFailure(e.message || "Failed to update cart item"));
    }
  };
