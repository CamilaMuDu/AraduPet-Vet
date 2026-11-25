import { createContext, useEffect, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { cartReducer, cartInitialState, CART_ACTION, getCountItems, getTotal } from '../reducers/cart';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { usuario } = useAuth();
  const clave = `aradupet-carrito-${usuario?.id_usuario || 'invitado'}`;
  const [cart, dispatch] = useReducer(cartReducer, cartInitialState, () => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(clave) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch { return []; }
  });
  useEffect(() => { sessionStorage.setItem(clave, JSON.stringify(cart)); }, [cart, clave]);
  const addItem = servicio => dispatch({ type: CART_ACTION.ADD_ITEM, payload: {
    id_servicio: Number(servicio.id_servicio), nombre: servicio.nombre,
    precio: Number(servicio.precio), duracion_minutos: Number(servicio.duracion_minutos)
  }});
  const removeItem = id => dispatch({ type: CART_ACTION.REMOVE_ITEM, payload: Number(id) });
  const cleanCart = () => dispatch({ type: CART_ACTION.CLEAN_CART });
  return <CartContext.Provider value={{ cart, addItem, removeItem, cleanCart, getTotal, getCountItems }}>
    {children}
  </CartContext.Provider>;
}
