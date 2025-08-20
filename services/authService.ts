/// <reference lib="dom" />
import { supabase } from '../supabaseClient';
import type { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw new Error(error.message);
    }
    if (!data.user) {
        throw new Error("Login failed: No user data returned.");
    }
    return data.user;
};

export const register = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        throw new Error(error.message);
    }
     if (!data.user) {
        throw new Error("Registration failed: No user data returned.");
    }
    return data.user;
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
    });
    if (error) {
        throw new Error(error.message);
    }
};

export const updatePassword = async (password: string): Promise<User> => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
        throw new Error(error.message);
    }
    if (!data.user) {
        throw new Error("Password update failed: No user data returned.");
    }
    return data.user;
};

export const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
        throw new Error(error.message);
    }
};