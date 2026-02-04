export default async function fetcher(path: string, method = "GET", body?: any) {
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api${path}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(body),
  });
  
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Invalid JSON response" };
  }
}
