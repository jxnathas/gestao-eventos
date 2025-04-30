import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  
  const navigateTo = (url: string) => {
    router.push(url);
  };

  const navigateTo404 = () => {
    router.push('/404');
  };
  
  return { navigateTo, navigateTo404 };
};