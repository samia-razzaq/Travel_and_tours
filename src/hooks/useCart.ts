// src/hooks/useAddToCart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddToCartPayload,
  AddToCartResponse,
  Cart,
  CartItem,
  CheckoutResponse,
  RemoveFromCartResponse,
  UpdateCartItemPayload,
  UpdateCartItemResponse,
} from "@/types/cart";
import { cartApi } from "@/services/api/endpoints";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  return useMutation<AddToCartResponse, Error, AddToCartPayload>({
    mutationFn: (payload) => cartApi.addToCart(payload),
    onSuccess: () => {
      // console.error("Add to cart success:", data);
      // Optionally invalidate/refetch cart-related queries
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: () => {
      // console.error("Add to cart failed:", message);
    },
  });
};

export const useCart = () => {
  const auth = useContext(AuthContext); // Import and use
  const { isLoading: authIsLoading, isAuthenticated, user } = auth || {};

  return useQuery<Cart>({
    queryKey: ["cart", user?.id],
    queryFn: () => cartApi.getCart(),
    enabled: !authIsLoading && isAuthenticated, // Prevent premature fire
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  return useMutation<RemoveFromCartResponse, Error, number>({
    mutationFn: (itemId) => cartApi.removeFromCart(itemId),
    onSuccess: (data) => {
      toast.success(data.message || "Item removed successfully");
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  return useMutation<
    UpdateCartItemResponse,
    Error,
    { itemId: number; payload: UpdateCartItemPayload }
  >({
    mutationFn: ({ itemId, payload }) =>
      cartApi.updateCartItem(itemId, payload),

    onSuccess: (data) => {
      toast.success(data?.message || "Cart item updated successfully!");
      // Invalidate and refetch the cart to get fresh data (including new total_price)
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update cart item");
    },
  });
};

// Newly added hook
// export const useCheckout = () => {
//   const queryClient = useQueryClient();
//   const auth = useContext(AuthContext);
//   const { user } = auth || {};

//   return useMutation<CheckoutResponse, Error>({
//     mutationFn: () => cartApi.checkout(),
//     onSuccess: (data) => {
//       if (data.error) {
//         toast.error(data.error);
//       } else {
//         toast.success(data.message || "Checkout successful");
//         queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
//       }
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to checkout");
//     },
//   });
// };
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  return useMutation<CheckoutResponse, Error>({
    mutationFn: () => cartApi.checkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });
};
