import { signup } from "../lib/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSignup = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (error) => toast.error(error?.response?.data?.error),
  });
  return { signupMutation: mutate, isPending };
};

export default useSignup;
