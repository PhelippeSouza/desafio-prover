import { createServer, Model } from "miragejs";
import { Store, Product } from "../types";

export function setupMirageServer() {
  createServer({
    models: {
      store: Model,
      product: Model,
    },


    routes() {
      // GET todas as lojas
      this.get("/stores", (schema) => {
        return schema.db.stores;
      });

      // GET uma loja específica
      this.get("/stores/:id", (schema, request) => {
        const { id } = request.params;
        const store = schema.db.stores.find((s: Store) => s.id === id);
        if (store) {
          const products = schema.db.products.filter(
            (p: Product) => p.storeId === id
          );
          return { ...store, products };
        }
        return null;
      });

      // POST nova loja
      this.post("/stores", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("store", {
          id: String(Date.now()),
          ...attrs,
        });
      });

      // DELETE loja
      this.delete("/stores/:id", (schema, request) => {
        const { id } = request.params;
        // Primeiro, deletar todos os produtos associados
        const products = schema.db.products.filter(
          (p: Product) => p.storeId === id
        );
        products.forEach((p: Product) => {
          schema.db.products.remove(p);
        });
        // Depois deletar a loja
        schema.db.stores.remove(
          schema.db.stores.find((s: Store) => s.id === id)
        );
        return { success: true };
      });

      // GET todos os produtos
      this.get("/products", (schema) => {
        return schema.db.products;
      });

      // GET produtos de uma loja
      this.get("/products?storeId=:storeId", (schema, request) => {
        const { storeId } = request.queryParams;
        return schema.db.products.filter(
          (p: Product) => p.storeId === storeId
        );
      });

      // POST novo produto
      this.post("/products", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create("product", {
          id: String(Date.now()),
          ...attrs,
        });
      });

      // DELETE produto
      this.delete("/products/:id", (schema, request) => {
        const { id } = request.params;
        schema.db.products.remove(
          schema.db.products.find((p: Product) => p.id === id)
        );
        return { success: true };
      });

      // PUT atualizar produto
      this.put("/products/:id", (schema, request) => {
        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        const product = schema.db.products.find((p: Product) => p.id === id);
        if (product) {
          Object.assign(product, attrs);
          return product;
        }
        return null;
      });

      // PUT atualizar loja
      this.put("/stores/:id", (schema, request) => {
        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        const store = schema.db.stores.find((s: Store) => s.id === id);
        if (store) {
          Object.assign(store, attrs);
          return store;
        }
        return null;
      });
    },
  });
}
