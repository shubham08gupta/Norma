import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { theme, themeMode, setThemeMode } = useTheme();
    const { colors } = theme;

    const renderRadioButton = (label, value) => {
        const isSelected = themeMode === value;
        return (
            <TouchableOpacity
                style={[styles.optionRow, { borderBottomColor: colors.border }]}
                onPress={() => setThemeMode(value)}
            >
                <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
                <View style={[styles.radioOuter, { borderColor: isSelected ? colors.primary : colors.subText }]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>APPEARANCE</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    {renderRadioButton('Light', 'light')}
                    {renderRadioButton('Dark', 'dark')}
                    {renderRadioButton('Auto (System Default)', 'auto')}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    sectionHeader: {
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    card: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
        fontSize: 16,
    },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
});
