// src/app/secret/layout.js
export const metadata = {
  title: "MM WALLET",
  description: "Congratulations.",
};

export default function SecretLayout({ children }) {
  // simply render the page inside your normal root-layout
  return <>{children}</>;
}
