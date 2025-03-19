async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-fit bg-slate-100 rounded-2xl p-8 min-w-[350px]">
        {children}
      </div>
    </div>
  );
}

export default Layout;
