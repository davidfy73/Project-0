export default function Footer() {
  return (
    <footer
      className="w-full py-4 px-6 text-center text-xs border-t transition-colors select-none"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      Powered by PHISHYEARN
    </footer>
  );
}
