import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

interface BookingDraft {
  packageId: string;
  adults: number;
  children: number;
  infants: number;
  pickupPlace: string;
  dropOffPlace: string;
  date: string; // ISO string for serialization
  transferOption: "shared" | "private" | "without_transfer";
}

type State = BookingDraft | null;

type Action =
  | { type: "SAVE"; payload: BookingDraft }
  | { type: "CLEAR" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SAVE":
      return action.payload;
    case "CLEAR":
      return null;
    default:
      return state;
  }
};

interface BookingDraftContextType {
  bookingDraft: State;
  saveBookingDraft: (draft: BookingDraft) => void;
  clearBookingDraft: () => void;
}

const BookingDraftContext = createContext<BookingDraftContextType | undefined>(undefined);

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bookingDraft");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: "SAVE", payload: parsed });
      } catch (error) {
        console.error("Failed to parse booking draft from localStorage:", error);
      }
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (state) {
      localStorage.setItem("bookingDraft", JSON.stringify(state));
    } else {
      localStorage.removeItem("bookingDraft");
    }
  }, [state]);

  const saveBookingDraft = (draft: BookingDraft) => {
    dispatch({ type: "SAVE", payload: draft });
  };

  const clearBookingDraft = () => {
    dispatch({ type: "CLEAR" });
  };

  return (
    <BookingDraftContext.Provider value={{ bookingDraft: state, saveBookingDraft, clearBookingDraft }}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export const useBookingDraft = () => {
  const context = useContext(BookingDraftContext);
  if (!context) {
    throw new Error("useBookingDraft must be used within a BookingDraftProvider");
  }
  return context;
};