import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useStore } from "../store/useStore";
import { Store } from "../types";
import { Link } from "expo-router";
import { store } from "expo-router/build/global-state/router-store";

interface StoreListProps {
  onSelectStore: (store: Store) => void;
}

export function StoreList({ onSelectStore }: StoreListProps) {
  const { stores, loading, fetchStores, deleteStore, updateStoreApi } = useStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [search, setSearch] = useState("");

  const filteredStores = stores.filter(
    (store) =>
      store?.name?.toLowerCase().includes(search.toLowerCase()) ||
      store?.location?.toLowerCase().includes(search.toLowerCase()),
  );

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
      ],
    );
  };

  const openEditModal = (item: Store) => {
    setEditingStore(item);
    setEditFormData({
      name: item.name,
      location: item.location,
      phone: item.phone || "",
    });
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingStore(null);
    setEditFormData({ name: "", location: "", phone: "" });
  };

  const handleSaveEdit = async () => {
    if (!editingStore) return;

    if (!editFormData.name.trim() || !editFormData.location.trim()) {
      Alert.alert("Erro", "Nome e localização são obrigatórios");
      return;
    }

    try {
      await updateStoreApi(editingStore.id, editFormData);
      await fetchStores();
      Alert.alert("Sucesso", "Loja atualizada com sucesso!");
      closeEditModal();
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar loja");
    }
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => onSelectStore(item)}
    >
      <View style={styles.storeHeader}>
        <Text style={styles.storeName}>{item.name}</Text>

        <View style={{ flexDirection: "row", gap: 12 }}>


        <TouchableOpacity
        
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text>Deletar</Text>
        </TouchableOpacity>

        <TouchableOpacity
         
          onPress={() => openEditModal(item)}
        >
          <Text>Editar</Text>
        </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.storeLocation}>📍 {item.location}</Text>
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
      {stores.length > 1 && (
        <TextInput
          style={styles.input}
          placeholder="Buscar loja..."
          value={search}
          onChangeText={setSearch}
        />
      )}
      {stores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhuma loja cadastrada. Crie a primeira loja!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}

      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Loja</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da loja"
              value={editFormData.name}
              onChangeText={(text) => setEditFormData((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Localização"
              value={editFormData.location}
              onChangeText={(text) => setEditFormData((prev) => ({ ...prev, location: text }))}
            />
            <View style={styles.modalButtons}> 
              <TouchableOpacity style={[ styles.cancelButton]} onPress={closeEditModal}>
                <Text >Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit}>
                <Text >Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#888",
  },
});
