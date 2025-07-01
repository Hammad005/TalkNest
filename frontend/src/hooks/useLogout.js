import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import toast from 'react-hot-toast';

const useLogout = () => {
  const queryClient = useQueryClient();
   const {mutate, isPending} = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        toast.success("Logout successful");
    },
    onError: (error) => console.log(error)
    
  });
  return {logoutMutation: mutate, isPending}
}

export default useLogout