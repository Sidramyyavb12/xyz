export default async function fetcher(path: string, method = "GET", body?: any) {
  const url = `${process.env.NEXT_PUBLIC_API || ""}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "GET" ? undefined : JSON.stringify(body),
  });
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Invalid JSON response" };
  }
}
