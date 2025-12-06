import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseService } from '../services/DatabaseService';
import { LLMService } from '../services/LLMService';

export default function SearchScreen() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!input.trim()) return;

        setLoading(true);
        try {
            // 1. Parse and Search via LLM Service
            const events = await LLMService.parseSearchQuery(input);

            setResults(events);
        } catch (error) {
            console.error('Error searching:', error);
            alert('Failed to search. Please check your API key and connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchHeader}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask a question..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    editable={!loading}
                />
                {loading ? (
                    <ActivityIndicator style={styles.loader} />
                ) : (
                    <TouchableOpacity onPress={handleSearch} style={styles.sendButton}>
                        <Ionicons name="search" size={24} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text style={styles.resultText}>{item.event_text}</Text>
                        <Text style={styles.resultTime}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading && <Text style={styles.emptyText}>No results found</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchHeader: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#f0f0f0',
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
    listContent: {
        padding: 16,
    },
    resultItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    resultTime: {
        fontSize: 12,
        color: '#888',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16,
    },
});
