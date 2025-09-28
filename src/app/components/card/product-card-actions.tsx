"use client";

import Link from "next/link";
import { deleteProduct } from "@/app/utils/service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ProductCardActionsProps {
  productId: string;
}

export default function ProductCardActions({
  productId,
}: ProductCardActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProduct(productId);

      toast.success("Product deleted successfully!");

      router.refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <Link
          href={`/products/edit/${productId}`}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors w-19"
        >
          Düzenle
        </Link>
        <button
          className={`bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors w-19 ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Siliniyor..." : "Sil"}
        </button>
      </div>
    </div>
  );
}
