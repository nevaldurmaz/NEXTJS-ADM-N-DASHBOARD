import OrderTable from "@/app/components/table/order-table";
import { FC } from "react";

const Orders: FC = () => {
  return (
    <div className="page">
      <h1 className="title"></h1>

      <OrderTable />
    </div>
  );
};

export default Orders;
