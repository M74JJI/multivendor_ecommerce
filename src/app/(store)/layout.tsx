// React
import { ReactNode } from "react";

// Components
import Header from "@/components/store/layout/header/header";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div>{children}</div>
      <div className="h-96"></div>
      <Footer />
    </div>
  );
}
