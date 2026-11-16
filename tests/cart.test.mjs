import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCart, updateCart, totalUnits, cartSubtotal } from '../src/lib/cart.js';

test('Agrega, incrementa, reduce y elimina libros del carrito', () => {
  let cart = updateCart([], 'dracula', 1);
  cart = updateCart(cart, 'dracula', 1);
  cart = updateCart(cart, 'alicia', 1);
  assert.equal(totalUnits(cart), 3);
  cart = updateCart(cart, 'dracula', -1);
  assert.equal(cart.find((entry) => entry.id === 'dracula').quantity, 1);
  cart = updateCart(cart, 'dracula', -1);
  assert.deepEqual(cart, [{ id: 'alicia', quantity: 1 }]);
});

test('Respeta límite de cantidades, ignora entradas corruptas y duplicadas', () => {
  assert.deepEqual(normalizeCart([{ id: 'dracula', quantity: 2 }, { id: 'dracula', quantity: 3 }, { id: 'bad!!', quantity: 1 }, { id: 'alicia', quantity: -1 }]), [{ id: 'dracula', quantity: 2 }]);
  const cart = updateCart([{ id: 'dracula', quantity: 20 }], 'dracula', 1);
  assert.equal(cart[0].quantity, 20);
});

test('Calcula subtotal a partir de los precios del catálogo REST', () => {
  const cart = [{ id: 'dracula', quantity: 2 }, { id: 'alicia', quantity: 1 }];
  const books = [{ id: 'dracula', price: 14990 }, { id: 'alicia', price: 13990 }];
  assert.equal(cartSubtotal(cart, books), 43970);
});
