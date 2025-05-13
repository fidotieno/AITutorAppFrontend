export async function initiateStkPush({ phone, amount, studentId, token }) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/api/payments/stk-push`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, amount, studentId }),
    }
  );

  const data = await response.json();
  return data;
}
