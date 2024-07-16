import Cookies from 'js-cookie';
import create from 'zustand';
import authService from '../service/auth.service';
import User from '../models/User';

interface GlobalState {

    token: boolean;
    user: User | null;
    setUser: (user: any) => void;
    clearUser: () => void;
    setToken: (token:boolean) => void;
    tokenExists: () => void;
    logout: () => void;
}

const useGlobalState = create<GlobalState>((set) => ({
    token: false,
    user: null,
    setToken: (token:boolean) => set({ token }),
    tokenExists: async () => {
        let token = Cookies.get('token');
        if (token) {
            let res = await authService.getUserInfo();
            set({ user: res});
            set({ token: true });
            return true;
        }
        return false;
    },
    clearUser: () => set({ user: null }),
    setUser: (user) => set({ user }),
    logout: async () => {
        try {
            await authService.logout();
            Cookies.remove('token');
            set({ user: null });
            set({ token: false });
        } catch (error) {
            console.error('Logout error', error);
            alert('Error al cerrar sesión');
        }
    }
}));

export default useGlobalState;