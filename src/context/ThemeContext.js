import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
    dark: false,
    colors: {
        background: '#f5f5f5',
        card: '#ffffff',
        text: '#333333',
        subText: '#888888',
        border: '#eeeeee',
        inputBackground: '#f0f0f0',
        primary: '#007AFF', // iOS Blue
        notification: '#ff3b30',
        tint: '#007AFF',
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        background: '#121212',
        card: '#1e1e1e',
        text: '#e0e0e0',
        subText: '#a0a0a0',
        border: '#333333',
        inputBackground: '#2c2c2c',
        primary: '#0a84ff', // iOS Dark Mode Blue
        notification: '#ff453a',
        tint: '#0a84ff',
    },
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme(); // 'light' or 'dark'
    const [themeMode, setThemeMode] = useState('auto'); // 'light' | 'dark' | 'auto'

    useEffect(() => {
        // Load saved theme on mount
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('userTheme');
                if (savedTheme) {
                    setThemeMode(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme', error);
            }
        };
        loadTheme();
    }, []);

    const changeThemeMode = async (mode) => {
        setThemeMode(mode);
        try {
            await AsyncStorage.setItem('userTheme', mode);
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

    const getActiveTheme = () => {
        if (themeMode === 'auto') {
            return systemScheme === 'dark' ? darkTheme : lightTheme;
        }
        return themeMode === 'dark' ? darkTheme : lightTheme;
    };

    const theme = getActiveTheme();

    return (
        <ThemeContext.Provider value={{ theme, themeMode, setThemeMode: changeThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
