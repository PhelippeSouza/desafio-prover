# Sistema de Gerenciamento de Lojas e Produtos

Um aplicativo React Native com Expo para gerenciar lojas e produtos, utilizando Zustand para estado e MirageJS para simular um backend.

## 🎯 Funcionalidades

### Lojas
- ✅ Cadastro de novas lojas
- ✅ Listagem de todas as lojas
- ✅ Visualização de detalhes da loja
- ✅ Exclusão de lojas (com confirmação)

### Produtos
- ✅ Cadastro de produtos vinculados a uma loja
- ✅ Listagem de produtos por loja
- ✅ Exibição de informações: preço, quantidade e descrição
- ✅ Exclusão de produtos (com confirmação)

## 🚀 Tecnologias Utilizadas

- **React Native** + **Expo**: Framework para desenvolvimento mobile
- **TypeScript**: Type safety
- **Zustand**: Gerenciamento de estado simples e eficiente
- **MirageJS**: Simulador de backend com endpoints RESTful

## 📱 Estrutura do Projeto

```
src/
├── components/
│   ├── StoreForm.tsx          # Formulário para criar loja
│   ├── StoreList.tsx          # Lista de lojas
│   ├── ProductForm.tsx        # Formulário para criar produto
│   ├── ProductList.tsx        # Lista de produtos
│   └── StoreManagement.tsx    # Componente principal
├── services/
│   └── mirageServer.ts        # Configuração do MirageJS
├── store/
│   └── useStore.ts            # Zustand store
└── types/
    └── index.ts               # Interfaces TypeScript
```

## 🔌 Endpoints MirageJS

### Lojas
- `GET /stores` - Listar todas as lojas
- `GET /stores/:id` - Obter loja específica com produtos
- `POST /stores` - Criar nova loja
- `DELETE /stores/:id` - Deletar loja

### Produtos
- `GET /products` - Listar todos os produtos
- `GET /products?storeId=:storeId` - Listar produtos da loja
- `POST /products` - Criar novo produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

## 📊 Tipos de Dados

### Store
```typescript
interface Store {
  id: string;
  name: string;
  location: string;
  phone?: string;
  products?: Product[];
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  storeId: string;
  description?: string;
  quantity?: number;
}
```

## 🎮 Como Usar

### 1. Instalar dependências
```bash
npm install
# ou
yarn install
```

### 2. Iniciar o projeto
```bash
npm start
# ou para web:
npm run web
```

### 3. Usar a aplicação

1. **Criar Loja**:
   - Preencha o formulário "Criar Nova Loja"
   - Clique em "Criar Loja"

2. **Selecionar Loja**:
   - Clique em uma loja da lista para ver seus produtos

3. **Adicionar Produto**:
   - Com uma loja selecionada, preencha o formulário "Adicionar Novo Produto"
   - Clique em "Adicionar Produto"

4. **Deletar Item**:
   - Clique no botão × em uma loja ou produto
   - Confirme a exclusão

## 🗂️ Dados Iniciais

O MirageJS vem com dados de exemplo:
- 3 lojas pré-cadastradas
- 6 produtos de exemplo distribuídos entre as lojas

## 🔄 Gerenciamento de Estado (Zustand)

O Zustand store (`useStore`) gerencia:
- Lista de lojas
- Lista de produtos
- Loja selecionada
- Estado de carregamento
- Mensagens de erro

### Ações Principais
```typescript
// Lojas
fetchStores()           // Carregar todas as lojas
createStore(data)       // Criar nova loja
deleteStore(storeId)    // Deletar loja

// Produtos
fetchProducts(storeId)           // Carregar produtos
createProduct(data, storeId)     // Criar produto
deleteProduct(productId)         // Deletar produto
updateProductQuantity(id, qty)   // Atualizar quantidade
```

## 📝 Exemplo de Uso do Store

```typescript
import { useStore } from './src/store/useStore';

export function MyComponent() {
  const { stores, fetchStores } = useStore();

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    // renderizar lojas
  );
}
```

## 🔮 Futuras Melhorias

- [ ] Edição de lojas e produtos
- [ ] Busca e filtros
- [ ] Ordenação de produtos
- [ ] Persistência local (AsyncStorage)
- [ ] Autenticação
- [ ] Integração com API real
- [ ] Temas personalizados
- [ ] Gráficos e estatísticas

## 📄 Licença

MIT
