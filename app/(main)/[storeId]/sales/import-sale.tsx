import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import React from "react";

const ImportSale = () => {
  return (
    <Link href="sales/import">
      <Button>
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Import dari Excel
      </Button>
    </Link>
  );
};

export default ImportSale;
