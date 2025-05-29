import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import consola from "consola";
import { keepPreviousData } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProductsByName,
  getLowStockProducts,
  getProductCountByCategory,
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getCategories,
} from "@/lib/actions/product.actions";
import { Product, Category } from "@/app/generated/prisma";
import {
  IdInput,
  CreateProductInput,
  UpdateProductInput,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/lib/validators";

interface PaginatedProductsDTO {
  products: Product[];
  total: number;
}

export const useProductManagement = () => {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState("size", parseAsInteger.withDefault(10));
  const [searchQuery, setSearchQuery] = useQueryState("query", parseAsString.withDefault(""));
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes("Slug") && err.message.includes("already in use")) {
        return "This slug is already in use.";
      }
      if (err.message.includes("not found")) {
        return err.message.includes("Product") ? "Product not found." : "Review not found.";
      }
      if (err.message.includes("Invalid categoryId")) {
        return "The specified category does not exist.";
      }
      if (err.message.includes("Invalid") && err.message.includes("ID")) {
        return "Invalid ID provided.";
      }
      if (err.message.includes("Invalid rating")) {
        return "Rating must be between 1 and 5.";
      }
      return err.message;
    }
    return "An unexpected error occurred.";
  };

  const { data: paginatedData, isLoading: isLoadingProducts, error: productsError } = useQuery< PaginatedProductsDTO, Error >({
    queryKey: ["products", pageIndex, pageSize, debouncedSearchQuery],
    queryFn: async () => {
      try {
        if (debouncedSearchQuery) {
          const products = await searchProductsByName(debouncedSearchQuery);
          consola.debug("Search result", { query: debouncedSearchQuery, products: products.length });
          return { products, total: products.length };
        }
        const products = await getAllProducts({ skip: pageIndex * pageSize, take: pageSize });
        const total = (await getProductCountByCategory()).reduce((sum, cat) => sum + cat.count, 0);
        consola.debug("Paginated result", { products: products.length, total });
        return { products, total };
      } catch (err) {
        consola.error("Error fetching products", { error: err });
        throw err;
      }
    },
    placeholderData: keepPreviousData,
    retry: 2,
  });

  const { data: productById, isLoading: isLoadingProductById, error: productByIdError } = useQuery<Product | null, Error>({
    queryKey: ["productById"],
    queryFn: async () => {
      const [id] = useQueryState("id", parseAsInteger.withDefault(0));
      if (!id) return null;
      const product = await getProductById(id);
      consola.debug("Fetched product by ID", { id, product });
      return product;
    },
    enabled: !!useQueryState("id", parseAsInteger.withDefault(0))[0],
    retry: 2,
  });

  const { data: productBySlug, isLoading: isLoadingProductBySlug, error: productBySlugError } = useQuery<Product | null, Error>({
    queryKey: ["productBySlug"],
    queryFn: async () => {
      const [slug] = useQueryState("slug", parseAsString.withDefault(""));
      if (!slug) return null;
      const product = await getProductBySlug(slug);
      consola.debug("Fetched product by slug", { slug, product });
      return product;
    },
    enabled: !!useQueryState("slug", parseAsString.withDefault(""))[0],
    retry: 2,
  });

  const { data: productsByCategory, isLoading: isLoadingProductsByCategory, error: productsByCategoryError } = useQuery<Product[], Error >({
    queryKey: ["productsByCategory"],
    queryFn: async () => {
      const [categoryId] = useQueryState("categoryId", parseAsInteger.withDefault(0));
      if (!categoryId) return [];
      const products = await getProductsByCategory(categoryId);
      consola.debug("Fetched products by category", { categoryId, products: products.length });
      return products;
    },
    enabled: !!useQueryState("categoryId", parseAsInteger.withDefault(0))[0],
    retry: 2,
  });

  const { data: lowStockProducts, isLoading: isLoadingLowStock, error: lowStockError } = useQuery<Product[], Error>({
    queryKey: ["lowStockProducts"],
    queryFn: async () => {
      const [threshold] = useQueryState("threshold", parseAsInteger.withDefault(10));
      const products = await getLowStockProducts(threshold);
      consola.debug("Fetched low stock products", { threshold, products: products.length });
      return products;
    },
    retry: 2,
  });

  const { data: productCountByCategory, isLoading: isLoadingProductCount, error: productCountError } = useQuery< { categoryId: number; count: number }[], Error >({
    queryKey: ["productCountByCategory"],
    queryFn: async () => {
      const counts = await getProductCountByCategory();
      consola.debug("Fetched product count by category", { counts });
      return counts;
    },
    retry: 2,
  });

  const { data: productReviews, isLoading: isLoadingReviews, error: reviewsError } = useQuery<any[], Error>({
    queryKey: ["productReviews"],
    queryFn: async () => {
      const [productId] = useQueryState("productId", parseAsInteger.withDefault(0));
      if (!productId) return [];
      const reviews = await getProductReviews(productId);
      consola.debug("Fetched product reviews", { productId, reviews: reviews.length });
      return reviews;
    },
    enabled: !!useQueryState("productId", parseAsInteger.withDefault(0))[0],
    retry: 2,
  });

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getCategories();
      consola.debug("Fetched categories", { categories: categories.length });
      return categories;
    },
    retry: 2,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onMutate: async (newProduct: CreateProductInput) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData<PaginatedProductsDTO>([
        "products",
        pageIndex,
        pageSize,
        debouncedSearchQuery,
      ]);

      const optimisticProduct: Product = {
        id: Date.now(),
        name: newProduct.name,
        slug: newProduct.slug,
        description: newProduct.description || null,
        model: newProduct.model || null,
        images: newProduct.images || [],
        categoryId: newProduct.categoryId,
        rating: 0,
        category: { id: newProduct.categoryId, name: categories?.find(c => c.id === newProduct.categoryId)?.name || "Unknown" },
        variants: newProduct.variants || [],
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        {
          products: [optimisticProduct, ...(previousData?.products || [])].slice(0, pageSize),
          total: (previousData?.total || 0) + 1,
        }
      );

      toast("Adding product...", {
        description: "Please wait while the product is being added.",
      });

      return { previousData };
    },
    onSuccess: () => {
      toast("Product added", {
        description: "The product has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productCountByCategory"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        context?.previousData
      );
      const message = getErrorMessage(err);
      consola.error("Error adding product", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: IdInput; data: UpdateProductInput }) => updateProduct(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData<PaginatedProductsDTO>([
        "products",
        pageIndex,
        pageSize,
        debouncedSearchQuery,
      ]);

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        {
          products:
            previousData?.products.map((product) =>
              product.id === id ? { ...product, ...data, updatedAt: new Date() } : product
            ) || [],
          total: previousData?.total || 0,
        }
      );

      toast("Updating product...", {
        description: "Please wait while the product is being updated.",
      });

      return { previousData };
    },
    onSuccess: () => {
      toast("Product updated", {
        description: "The product has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productById"] });
      queryClient.invalidateQueries({ queryKey: ["productBySlug"] });
      queryClient.invalidateQueries({ queryKey: ["productsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["productCountByCategory"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        context?.previousData
      );
      const message = getErrorMessage(err);
      consola.error("Error updating product", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id: IdInput) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData<PaginatedProductsDTO>([
        "products",
        pageIndex,
        pageSize,
        debouncedSearchQuery,
      ]);

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        {
          products: previousData?.products.filter((product) => product.id !== id) || [],
          total: Math.max((previousData?.total || 0) - 1, 0),
        }
      );

      toast("Deleting product...", {
        description: "Please wait while the product is being deleted.",
      });

      return { previousData };
    },
    onSuccess: () => {
      toast("Product deleted", {
        description: "The product has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productById"] });
      queryClient.invalidateQueries({ queryKey: ["productBySlug"] });
      queryClient.invalidateQueries({ queryKey: ["productsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["productCountByCategory"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        context?.previousData
      );
      const message = getErrorMessage(err);
      consola.error("Error deleting product", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onMutate: async (newReview: CreateReviewInput) => {
      await queryClient.cancelQueries({ queryKey: ["productReviews"] });
      const previousReviews = queryClient.getQueryData<any[]>(["productReviews"]);

      const optimisticReview = {
        id: `temp-${Date.now()}`,
        productId: newReview.productId,
        userId: newReview.userId,
        rating: newReview.rating,
        comment: newReview.comment || null,
        user: { name: "Unknown" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(
        ["productReviews"],
        [optimisticReview, ...(previousReviews || [])]
      );

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        (old: PaginatedProductsDTO | undefined) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((p) =>
              p.id === newReview.productId
                ? { ...p, reviews: [...p.reviews, optimisticReview], rating: calculateNewRating([...p.reviews, optimisticReview]) }
                : p
            ),
          };
        }
      );

      toast("Adding review...", {
        description: "Please wait while the review is being added.",
      });

      return { previousReviews };
    },
    onSuccess: () => {
      toast("Review added", {
        description: "The review has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["productReviews"], context?.previousReviews);
      const message = getErrorMessage(err);
      consola.error("Error adding review", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: IdInput; data: UpdateReviewInput }) => updateReview(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["productReviews"] });
      const previousReviews = queryClient.getQueryData<any[]>(["productReviews"]);

      queryClient.setQueryData(
        ["productReviews"],
        (old: any[] | undefined) =>
          old?.map((review) =>
            review.id === id ? { ...review, ...data, updatedAt: new Date() } : review
          ) || []
      );

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        (old: PaginatedProductsDTO | undefined) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((p) => {
              if (!p.reviews.some((r) => r.id === id)) return p;
              const updatedReviews = p.reviews.map((r) =>
                r.id === id ? { ...r, ...data, updatedAt: new Date() } : r
              );
              return { ...p, reviews: updatedReviews, rating: calculateNewRating(updatedReviews) };
            }),
          };
        }
      );

      toast("Updating review...", {
        description: "Please wait while the review is being updated.",
      });

      return { previousReviews };
    },
    onSuccess: () => {
      toast("Review updated", {
        description: "The review has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["productReviews"], context?.previousReviews);
      const message = getErrorMessage(err);
      consola.error("Error updating review", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onMutate: async (id: IdInput) => {
      await queryClient.cancelQueries({ queryKey: ["productReviews"] });
      const previousReviews = queryClient.getQueryData<any[]>(["productReviews"]);

      const productId = previousReviews?.find((r) => r.id === id)?.productId;
      queryClient.setQueryData(
        ["productReviews"],
        (old: any[] | undefined) => old?.filter((review) => review.id !== id) || []
      );

      queryClient.setQueryData(
        ["products", pageIndex, pageSize, debouncedSearchQuery],
        (old: PaginatedProductsDTO | undefined) => {
          if (!old || !productId) return old;
          return {
            ...old,
            products: old.products.map((p) => {
              if (p.id !== productId) return p;
              const updatedReviews = p.reviews.filter((r) => r.id !== id);
              return { ...p, reviews: updatedReviews, rating: calculateNewRating(updatedReviews) };
            }),
          };
        }
      );

      toast("Deleting review...", {
        description: "Please wait while the review is being deleted.",
      });

      return { previousReviews, productId };
    },
    onSuccess: () => {
      toast("Review deleted", {
        description: "The review has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["productReviews"], context?.previousReviews);
      const message = getErrorMessage(err);
      consola.error("Error deleting review", { error: err });
      toast("Error", {
        description: message,
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    },
  });

  const calculateNewRating = (reviews: any[]) => {
    return reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
      : 0;
  };

  return {
    paginatedData,
    isLoadingProducts,
    productsError,
    productById,
    isLoadingProductById,
    productByIdError,
    productBySlug,
    isLoadingProductBySlug,
    productBySlugError,
    productsByCategory,
    isLoadingProductsByCategory,
    productsByCategoryError,
    lowStockProducts,
    isLoadingLowStock,
    lowStockError,
    productCountByCategory,
    isLoadingProductCount,
    productCountError,
    productReviews,
    isLoadingReviews,
    reviewsError,
    categories,
    isLoadingCategories,
    categoriesError,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    createReviewMutation,
    updateReviewMutation,
    deleteReviewMutation,
    getErrorMessage,
  };
};