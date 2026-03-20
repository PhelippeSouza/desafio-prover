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
import { Product } from "../types";

interface ProductListProps {
  storeId: string;
  onProductsUpdated?: () => void;
}

export function ProductList({ storeId, onProductsUpdated }: ProductListProps) {
  const { products, loading, fetchProducts, deleteProduct } = useStore();



  useEffect(() => {
    if (storeId) {
      fetchProducts(storeId);
    }
  }, [storeId, products.length]);

  const storeProducts = products.filter((p) => p.storeId === storeId);

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert(
      "Confirmar",
      `Deseja deletar o produto "${productName}"?`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            await deleteProduct(productId);
            await fetchProducts(storeId);
            onProductsUpdated?.();
            Alert.alert("Sucesso", "Produto deletado com sucesso!");
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    console.log("Renderizando produto:", item.id),
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Preço:</Text>
          <Text style={styles.value}>
            R$ {item.price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Quantidade:</Text>
          <Text style={styles.value}>{item.quantity || 0} un.</Text>
        </View>

        {item.description && (
          <View style={styles.descriptionRow}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos da Loja</Text>
      {storeProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhum produto cadastrado nesta loja.
          </Text>
        </View>
      ) : (
        <FlatList
          data={storeProducts}
          renderItem={renderProductItem}
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
  productCard: {
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
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productName: {
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
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  descriptionRow: {
    marginTop: 8,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
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
