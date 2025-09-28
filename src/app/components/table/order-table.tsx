"use client";

import { FC, useState, useEffect } from "react";
import TableWrapper from "./table-wrapper";
import { getOrders } from "@/app/utils/service";
import { Order } from "@/app/types";
import CreateOrderForm from "./create-order-form";

const OrderTable: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Siparişler yüklenirken hata:", error);
      }
    };
    fetchOrders();
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case "Kargoya Verildi":
        return "bg-blue-600";
      case "Teslim Edildi":
        return "bg-green-600";
      case "İşleniyor":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Siparişler</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Yeni Sipariş
        </button>
      </div>

      {/* Sipariş Oluşturma Formu */}
      {showForm && (
        <CreateOrderForm
          onClose={() => setShowForm(false)}
          onOrderCreated={(newOrder) => {
            setOrders((prevOrders) => [...prevOrders, newOrder]);
            setShowForm(false);
          }}
        />
      )}

      {/* Mevcut Tablo */}
      <TableWrapper>
        <thead>
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Sipariş Tarihi</th>
            <th className="p-3">Ürün Sayısı</th>
            <th className="p-3">Toplam Fiyat</th>
            <th className="p-3">Adres</th>
            <th className="p-3">Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, key) => (
            <tr key={order.id || key} className="border-b">
              <td className="p-3">{key + 1}</td>
              <td className="p-3">
                {new Date(order.order_date).toLocaleDateString("tr", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
              <td className="p-3">
                {order.items.reduce((acc, item) => acc + item.quantity, 0)}
              </td>
              <td className="p-3 text-green-600 font-semibold">
                ₺
                {Number(order.total_price).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="p-3">{order.shipping_address.city}</td>
              <td className="p-3">
                <span
                  className={`${getColor(
                    order.status
                  )} text-white py-1 px-3 rounded-lg text-sm`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
};

export default OrderTable;
