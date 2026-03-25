import { IInvoiceItem } from "@/types";
import { DeleteIcon, Pencil, X } from "lucide-react";
import React from "react";

function SingleInvoiceItem({
  setActiveInvoiceItem,
  invoiceItem,
  onDeleteInvoice,
}: {
  invoiceItem: IInvoiceItem;
  setActiveInvoiceItem: React.Dispatch<IInvoiceItem>;
  onDeleteInvoice: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 border border-[#bdbdbd3e] rounded-xl w-full">
      <div>
        <h5 className="text-lg font-bold">{invoiceItem.amount}</h5>
        <p className="text-base ">{invoiceItem.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveInvoiceItem(invoiceItem)}
          className="p-2 rounded bg-[#4b4b4b8c]"
        >
          <Pencil size={15} color="#fff" />
        </button>
        <button
          type="button"
          onClick={onDeleteInvoice}
          className="p-2 rounded bg-[#f71919]"
        >
          <X size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export default SingleInvoiceItem;
