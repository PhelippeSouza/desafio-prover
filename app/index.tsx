import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProductForm, ProductList, StoreForm, StoreList} from "../src/components";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { setupMirageServer } from "../src/services/mirageServer";
import { Store } from "../src/types";

export default function Page() {
    useEffect(() => {
      // Inicializar o servidor MirageJS
      if (process.env.NODE_ENV === 'development') {
        setupMirageServer();
      }
    }, []);


     const [selectedStore, setSelectedStore] = useState<Store | null>(null);
      const [refreshTrigger, setRefreshTrigger] = useState(0);
    
      const handleStoreCreated = () => {
        setRefreshTrigger((prev) => prev + 1);
      };
    
      const handleProductCreated = () => {
        setRefreshTrigger((prev) => prev + 1);
      };
    
      const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
      };
    
      const handleBackToStores = () => {
        setSelectedStore(null);
      };
    
      if (selectedStore) {
        return (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToStores}
              >
                <Text style={styles.backButtonText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.storeTitle}>{selectedStore.name}</Text>
            </View>
    
            <View style={styles.storeInfo}>
              <Text style={styles.infoLabel}>Localização:</Text>
              <Text style={styles.infoValue}>{selectedStore.location}</Text>
              {selectedStore.phone && (
                <>
                  <Text style={styles.infoLabel}>Telefone:</Text>
                  <Text style={styles.infoValue}>{selectedStore.phone}</Text>
                </>
              )}
            </View>
    
            <ProductForm
              storeId={selectedStore.id}
              onProductCreated={handleProductCreated}
            />
            <ProductList
              storeId={selectedStore.id}
              onProductsUpdated={handleProductCreated}
            />
          </ScrollView>
        );
      }
  
  return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Gerenciador de Lojas</Text>
          </View>
    
          <StoreForm onStoreCreated={handleStoreCreated} />
          <StoreList onSelectStore={handleSelectStore} />
        </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  storeTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  storeInfo: {
    backgroundColor: "#f0f8ff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
});


