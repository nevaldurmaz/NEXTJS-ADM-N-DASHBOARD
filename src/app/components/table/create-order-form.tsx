"use client";

import { FC, useState, useEffect } from "react";
import {
  createOrder,
  getOrders,
  getProducts,
  getUsers,
} from "@/app/utils/service";
import { Order, Product, User } from "@/app/types";

interface CreateOrderFormProps {
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
}

const CreateOrderForm: FC<CreateOrderFormProps> = ({
  onClose,
  onOrderCreated,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [status, setStatus] = useState<string>("Processing");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, productsData] = await Promise.all([
          getUsers(),
          getProducts(),
        ]);
        setUsers(usersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      }
    };
    fetchData();
  }, []);

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof SelectedProduct,
    value: string
  ) => {
    const updated = [...selectedProducts];
    if (field === "productId") {
      updated[index].productId = value;
    } else {
      updated[index].quantity = parseInt(value) || 1;
    }
    setSelectedProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedUserId || selectedProducts.length === 0) {
      alert("Lütfen kullanıcı ve en az bir ürün seçin");
      setIsLoading(false);
      return;
    }

    // Boş ürünleri filtrele
    const validProducts = selectedProducts.filter((sp) => sp.productId !== "");
    if (validProducts.length === 0) {
      alert("Lütfen geçerli ürünler seçin");
      setIsLoading(false);
      return;
    }

    try {
      const selectedUser = users.find((u) => u.id === selectedUserId);
      if (!selectedUser) throw new Error("Kullanıcı bulunamadı");

      // NULL DEĞER DÖNDÜRMEYEN VERSİYON - HATA DÜZELTME
      const orderItems = validProducts.map((sp) => {
        const product = products.find((p) => p.id === sp.productId);
        if (!product) {
          throw new Error(`Ürün bulunamadı: ${sp.productId}`);
        }
        return {
          product_id: parseInt(product.id),
          name: product.name,
          quantity: sp.quantity,
          price: product.price,
        };
      });

      const totalPrice = orderItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      // Yeni order ID oluştur
      const existingOrders = await getOrders();
      const newOrderId =
        Math.max(...existingOrders.map((o) => o.order_id), 0) + 1;

      const newOrder = {
        order_id: newOrderId,
        user_id: parseInt(selectedUserId),
        order_date: new Date().toISOString().split("T")[0],
        status: status,
        total_price: totalPrice,
        shipping_address: selectedUser.address,
        items: orderItems,
      };

      const createdOrder = await createOrder(newOrder);
      onOrderCreated(createdOrder);
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
      alert("Sipariş oluşturulurken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Yeni Sipariş Oluştur</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Kullanıcı *
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Ürünler *</label>
              <button
                type="button"
                onClick={addProduct}
                className="text-blue-600 text-sm"
                disabled={isLoading}
              >
                + Ürün Ekle
              </button>
            </div>

            {selectedProducts.map((sp, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <select
                  value={sp.productId}
                  onChange={(e) =>
                    updateProduct(index, "productId", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                  required
                  disabled={isLoading}
                >
                  <option value="">Ürün Seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₺{product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={sp.quantity}
                  onChange={(e) =>
                    updateProduct(index, "quantity", e.target.value)
                  }
                  className="w-20 p-2 border rounded"
                  placeholder="Adet"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 px-2"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Durum */}
          <div>
            <label className="block text-sm font-medium mb-1">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="Processing">İşleniyor</option>
              <option value="Shipped">Kargoya Verildi</option>
              <option value="Delivered">Teslim Edildi</option>
            </select>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Oluşturuluyor..." : "Sipariş Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderForm;
