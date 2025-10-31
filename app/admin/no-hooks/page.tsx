export default function NoHooksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F715D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#0F715D',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Admin Login
        </h1>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          Simple test without React hooks
        </p>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px',
              fontSize: '14px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          />
        </div>
        <button
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0F715D',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Login
        </button>
        <div style={{
          fontSize: '12px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Default Login:</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
        <a
          href="/"
          style={{
            color: '#0F715D',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Kembali ke Layar Masjid
        </a>
      </div>
    </div>
  )
}