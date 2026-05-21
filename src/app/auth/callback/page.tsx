"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const redirect = searchParams.get("redirect") || "/feed";

    async function handleCallback() {
      if (!code) {
        router.replace("/auth/login?error=no_code");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        router.replace("/auth/login?error=auth_failed");
      } else {
        router.replace(redirect);
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return <p>Processing authentication...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Processing authentication...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
