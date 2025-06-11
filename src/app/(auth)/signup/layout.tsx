export default function SignupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>; // Just return the modal without replacing content
}
