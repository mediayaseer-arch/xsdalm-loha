import {
  useNavigate,
  useSearchParams as useReactSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}

export function useSearchParams() {
  const [searchParams] = useReactSearchParams();
  return searchParams;
}