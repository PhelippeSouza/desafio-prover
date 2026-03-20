// ============================================================
// EXEMPLO DE USO DO SISTEMA DE LOJAS E PRODUTOS
// ============================================================

import { useStore } from './store/useStore';
import { Store, Product, StoreFormData, ProductFormData } from './types';

// ============================================================
// 1. USANDO O ZUSTAND STORE
// ============================================================

export function ExemploUsoStore() {
  const { 
    stores, 
    products, 
    loading, 
    error,
    fetchStores,
    createStore,
    deleteStore,
    createProduct,
    deleteProduct,
  } = useStore();

  // Carregar lojas
  const handleLoadStores = async () => {
    await fetchStores();
  };

  // Criar nova loja
  const handleCreateStore = async () => {
    const novaLoja: StoreFormData = {
      name: 'Minha Loja',
      location: 'Rua Principal, 123',
      phone: '(11) 99999-9999',
    };
    await createStore(novaLoja);
  };

  // Criar novo produto
  const handleCreateProduct = async (storeId: string) => {
    const novoProduto: ProductFormData = {
      name: 'Novo Produto',
      price: 99.99,
      quantity: 10,
      description: 'Descrição do produto',
    };
    await createProduct(novoProduto, storeId);
  };

  // Deletar loja
  const handleDeleteStore = async (storeId: string) => {
    await deleteStore(storeId);
  };

  // Deletar produto
  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  return {
    stores,
    products,
    loading,
    error,
    handleLoadStores,
    handleCreateStore,
    handleCreateProduct,
    handleDeleteStore,
    handleDeleteProduct,
  };
}

// ============================================================
// 2. PADRÃO DE USO NOS COMPONENTES
// ============================================================

import React, { useEffect } from 'react';
import { View, FlatList, Text, Button } from 'react-native';

export function ExemploComponente() {
  const { stores, fetchStores, createStore } = useStore();

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Renderizar lojas
  const renderStore = ({ item }: { item: Store }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.location}</Text>
    </View>
  );

  return (
    <View>
      <Button 
        title="Carregar Lojas" 
        onPress={fetchStores} 
      />
      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

// ============================================================
// 3. ENDPOINTS DISPONÍVEIS
// ============================================================

/*
LOJAS:
- GET /stores                    - Listar todas
- GET /stores/:id               - Obter uma específica com produtos
- POST /stores                  - Criar nova
- DELETE /stores/:id            - Deletar

PRODUTOS:
- GET /products                 - Listar todos
- GET /products?storeId=:id    - Listar da loja
- POST /products                - Criar novo
- PUT /products/:id             - Atualizar
- DELETE /products/:id          - Deletar
*/

// ============================================================
// 4. DADOS INICIAIS DO MIRAGEJS
// ============================================================

/*
LOJAS:
1. "Loja Centro" - Av. Paulista, 1000
2. "Loja Zona Sul" - Rua Augusta, 2500
3. "Loja Shopping" - Shopping Center, 3000

PRODUTOS:
Loja 1:
- Notebook (R$ 3999.99)
- Mouse Wireless (R$ 89.99)

Loja 2:
- Teclado Mecânico (R$ 450.00)
- Monitor 27 polegadas (R$ 1299.99)

Loja 3:
- Webcam HD (R$ 199.99)
- Headset Gamer (R$ 299.99)
*/

// ============================================================
// 5. TIPOS DISPONÍVEIS
// ============================================================

/*
Store {
  id: string
  name: string
  location: string
  phone?: string
  products?: Product[]
}

Product {
  id: string
  name: string
  price: number
  storeId: string
  description?: string
  quantity?: number
}

StoreFormData {
  name: string
  location: string
  phone?: string
}

ProductFormData {
  name: string
  price: number
  description?: string
  quantity?: number
}
*/
