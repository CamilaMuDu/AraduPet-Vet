export const CART_ACTION = {
  ADD_ITEM: 'ADD_ITEM', REMOVE_ITEM: 'REMOVE_ITEM', CLEAN_CART: 'CLEAN_CART'
};
export const cartInitialState = [];
export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTION.ADD_ITEM:
      return state.some(item => item.id_servicio === action.payload.id_servicio)
        ? state : [...state, action.payload];
    case CART_ACTION.REMOVE_ITEM:
      return state.filter(item => item.id_servicio !== action.payload);
    case CART_ACTION.CLEAN_CART: return [];
    default: return state;
  }
};
export const getCountItems = cart => cart.length;
export const getTotal = cart => cart.reduce((total, item) => total + Number(item.precio || 0), 0);
