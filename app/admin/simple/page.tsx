export default function SimplePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple React Test Page</h1>
      <p>This is a simple React component to test rendering.</p>
      <div style={{ background: '#0F715D', color: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Test Content</h2>
        <p>If you can see this, React is working.</p>
        <a href="/admin/login" style={{ color: '#40A49C', textDecoration: 'none' }}>
          ← Go to Admin Login
        </a>
      </div>
    </div>
  )
}