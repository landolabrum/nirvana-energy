import { useCallback, useEffect, useState } from "react";
import { getService } from "@webstack/common";
import useSessionStorage from "@webstack/hooks/storage/useSessionStorage";
import { useLoader } from "@webstack/components/Loader/Loader";
import IProductService from "~/src/core/services/ProductService/IProductService";
import { IProduct } from "~/src/models/Shopping/IProduct";
import environment from "~/src/core/environment";

export const useProducts = () => {
    const {mid}=environment.merchant;
  const EXPIRY = 60000; // 1 minute
  const productService = getService<IProductService>("IProductService");
  const { sessionData, setSessionItem } = useSessionStorage();
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useLoader();

  const fetchProducts = useCallback(async () => {
    if (loading || products) return;
    const cachedData = sessionData?.products;
    const isExpired = cachedData && Date.now() - cachedData.created > EXPIRY;
    const merchantProductHandler = (products:IProduct[])=>{
        if(!products)return;
        return products.filter(product => product.metadata.mid == mid);
    }
    if (cachedData && !isExpired) {
        const merchantProducts = merchantProductHandler(cachedData.data);
        merchantProducts && setProducts(merchantProducts);
        setHasMore(cachedData.has_more);
    } else {
        setLoader({ active: true });
        setLoading(true);
        try {
            const response = await productService.getProducts({ limit: 10 }); // Adjust your API request here
            if (response?.data) {
                const newData = { ...response, created: Date.now() };
                setSessionItem("products", newData, { expiry: EXPIRY });
                const merchantProducts = merchantProductHandler(response.data);
                merchantProducts && setProducts(merchantProducts);
          setHasMore(response.has_more);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoader({ active: false });
        setLoading(false);
      }
    }
  }, [loading, products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, hasMore, error, fetchProducts };
};