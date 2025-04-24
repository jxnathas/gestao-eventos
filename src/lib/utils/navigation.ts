import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  
  const navigateTo = (url: string) => {
    router.push(url);
  }; 
  
  return { navigateTo };
};