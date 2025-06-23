// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState(null); // 'user' vuelve a ser solo el objeto de usuario de Firebase Auth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // ¡REVERTIDO! Ya no es 'async'
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); // ¡REVERTIDO! Sin dependencias extra

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    } finally {
      setLoading(false);
    };
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}