async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white  dark:bg-zinc-900">
      {children}
    </div>
  );
}

export default Layout;
