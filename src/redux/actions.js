import { createFavorite, deleteFavorite, fetchFavorites } from "../utils/api";

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
