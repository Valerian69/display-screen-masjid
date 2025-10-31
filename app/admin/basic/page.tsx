'use client'

export default function BasicPage() {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0F715D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h1 style={{ color: '#0F715D', marginBottom: '20px' }}>
              Basic Test Page
            </h1>
            <p style={{ marginBottom: '20px' }}>
              If you can see this, the basic React rendering works.
            </p>
            <a
              href="/admin/login"
              style={{
                color: '#0F715D',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}