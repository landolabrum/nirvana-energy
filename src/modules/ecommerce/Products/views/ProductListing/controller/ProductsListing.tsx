import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "./ProductsListing.scss";
import { useProducts } from "../../../hooks/useProducts";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import ProductListingItem from "../views/ProductListingItem/ProductListingItem";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import UiButton from "@webstack/components/UiButton/UiButton";

const ProductsListing: NextPage = () => {
  const router = useRouter();
  const { query, pathname } = router;
  const { products, loading, hasMore } = useProducts();
  const [layout, setLayout] = useState("grid");
  const layouts: any = {
    grid: { gap: 10, xs: 2, md: 3, lg: 4, xl: 5 },
    list: { gap: 10, xs: 1 },
  };


  const handleLayoutChange = (newLayout: string) => {
    setLayout(newLayout);
    router.push({ pathname, query: { ...query, layout: newLayout } }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="products-listing">
        <UiSettingsLayout
          theme="light"
          variant="full-width"
          title={
            <div className="products-listing__header">
              <h1>Products ({products?.length || 0})</h1>
              <div className="products-listing__layout-actions">
                {["grid", "list"].map((view) => (
                  <span key={view}>
                    <UiIcon
                      icon={`fa-${view}`}
                      onClick={() => handleLayoutChange(view)}
                    />
                  </span>
                ))}
              </div>
            </div>
          }
          views={{
            products: loading ? (
              <p>Loading...</p>
            ) : (
              <AdaptGrid gap={10} xs={2} md={3}>
                {products?.map((product, key) => (
                  <ProductListingItem key={key} product={product} layout={layouts[layout]} />
                ))}
              </AdaptGrid>
            ),
          }}
          footer={
            hasMore && (
              <div className="products-listing__footer">
                <UiButton>Load More</UiButton>
              </div>
            )
          }
        />
      </div>
    </>
  );
};

export default ProductsListing;
