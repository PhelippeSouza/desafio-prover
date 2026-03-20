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
import { ProductFormData } from "../types";

interface ProductFormProps {
  storeId: string;
  onProductCreated?: () => void;
}

export function ProductForm({ storeId, onProductCreated }: ProductFormProps) {
  const { createProduct, loading } = useStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    quantity: 0,
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Nome do produto é obrigatório");
      return;
    }

    if (formData.price <= 0) {
      Alert.alert("Erro", "Preço deve ser maior que zero");
      return;
    }

    try {
      await createProduct(formData, storeId);
      Alert.alert("Sucesso", "Produto criado com sucesso!");
      setFormData({ name: "", price: 0, description: "", quantity: 0 });
      onProductCreated?.();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar produto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={formData.name}
        onChangeText={(text) =>
          setFormData({ ...formData, name: text })
        }
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={formData.price.toString()}
        onChangeText={(text) =>
          setFormData({ ...formData, price: parseFloat(text) || 0 })
        }
        keyboardType="decimal-pad"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={formData.quantity?.toString()}
        onChangeText={(text) =>
          setFormData({ ...formData, quantity: parseInt(text) || 0 })
        }
        keyboardType="number-pad"
        editable={!loading}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição (opcional)"
        value={formData.description}
        onChangeText={(text) =>
          setFormData({ ...formData, description: text })
        }
        multiline
        numberOfLines={3}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adicionando..." : "Adicionar Produto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f8ff",
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
  textArea: {
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#34C759",
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
