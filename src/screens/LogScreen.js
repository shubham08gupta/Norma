import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseService } from '../services/DatabaseService';
import { LLMService } from '../services/LLMService';

import { useTheme } from '../context/ThemeContext';

export default function LogScreen() {
    const { theme } = useTheme();
    const { colors } = theme;

    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const events = await DatabaseService.getAllEvents();
            setLogs(events);
        } catch (error) {
            console.error('Failed to load logs', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        try {
            // 1. Log event via LLMService (handles DB saving internally)
            await LLMService.logEvent(input);

            // 2. Refresh list and clear input
            setInput('');
            loadLogs();
        } catch (error) {
            console.error('Error logging event:', error);
            alert('Failed to log event. Please check your API key and connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="Log something..."
                    placeholderTextColor={colors.subText}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    editable={!loading}
                />
                {loading ? (
                    <ActivityIndicator style={styles.loader} color={colors.primary} />
                ) : (
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <FlatList
                    data={logs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.logItem, { backgroundColor: colors.card }]}>
                            <Text style={[styles.logText, { color: colors.text }]}>{item.event_text}</Text>
                            <Text style={[styles.logTime, { color: colors.subText }]}>{new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    logItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logText: {
        fontSize: 16,
        marginBottom: 4,
    },
    logTime: {
        fontSize: 12,
    },
    inputContainer: {
        padding: 16,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    loader: {
        marginLeft: 10,
    },
    sendButton: {
        marginLeft: 10,
        padding: 8,
    },
});
