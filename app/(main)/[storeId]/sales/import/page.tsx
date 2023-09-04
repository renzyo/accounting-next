import { FileSpreadsheet } from "lucide-react";
import React from "react";

const ImportPage = () => {
  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <div className="flex gap-2 items-center">
          <FileSpreadsheet className="w-8 h-8" />
          <h2 className="font-semibold text-xl">Import Penjualan dari Excel</h2>
        </div>
      </header>
      <div className="mt-8"></div>
    </section>
  );
};

export default ImportPage;
