import React from 'react'
import { login } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (error) => toast.error(error?.response?.data?.error),
  });

  return { loginMutation: mutate, isPending };
}

export default useLogin