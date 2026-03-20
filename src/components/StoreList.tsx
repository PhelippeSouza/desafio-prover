import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useStore } from "../store/useStore";
import { Store } from "../types";
import {Link} from 'expo-router'

interface StoreListProps {
  onSelectStore: (store: Store) => void;
}

export function StoreList({ onSelectStore }: StoreListProps) {
  const { stores, loading, fetchStores, deleteStore } = useStore();

  useEffect(() => {
    fetchStores();
  }, [stores.length]);

  const handleDelete = (storeId: string, storeName: string) => {
    Alert.alert(
      "Confirmar",
      `Deseja deletar a loja "${storeName}"? Todos os produtos serão removidos.`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            await deleteStore(storeId);
            await fetchStores();
            Alert.alert("Sucesso", "Loja deletada com sucesso!");
          },
          style: "destructive",
        },
      ]
    );
  };




 
  const renderStoreItem = ({ item }: { item: Store }) => (
    console.log("Renderizando loja:", item),
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => onSelectStore(item)}
    >
      <View style={styles.storeHeader}>
        <Text style={styles.storeName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.storeLocation}>📍 {item.location}</Text>
      {item.phone && <Text style={styles.storePhone}>📱 {item.phone}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando lojas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>    

      <Text style={styles.title}>Lojas Cadastradas</Text>
      {stores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhuma loja cadastrada. Crie a primeira loja!
          </Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  storeCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  storeLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  storePhone: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  emptyState: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
