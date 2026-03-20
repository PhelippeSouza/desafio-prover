import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useStore } from "../store/useStore";
import { StoreFormData } from "../types";

export function StoreForm({
  onStoreCreated,
}: {
  onStoreCreated?: () => void;
}) {
  const { createStore, loading } = useStore();
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    location: "",
    phone: "",
  });

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      Alert.alert("Erro", "Nome e localização são obrigatórios");
      return;
    }

    try {
      await createStore(formData);
      Alert.alert("Sucesso", "Loja criada com sucesso!");
      setFormData({ name: "", location: "", phone: "" });
      onStoreCreated?.();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar loja");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Loja</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da loja"
        value={formData.name}
        onChangeText={(text) =>
          setFormData({ ...formData, name: text })
        }
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={formData.location}
        onChangeText={(text) =>
          setFormData({ ...formData, location: text })
        }
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone (opcional)"
        value={formData.phone}
        onChangeText={(text) =>
          setFormData({ ...formData, phone: text })
        }
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Criando..." : "Criar Loja"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
