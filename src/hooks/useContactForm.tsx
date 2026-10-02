import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { contactApi } from "@/services/api/endpoints";
import { ContactFormData, ContactResponse } from "@/types/tourism";

export const useContactInquiry = () => {
  return useMutation<ContactResponse, AxiosError<any>, ContactFormData>({
    mutationFn: (data: ContactFormData) => contactApi.sendInquiry(data),
  });
};
