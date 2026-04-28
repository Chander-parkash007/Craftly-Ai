const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Add LoginScreen and SignupScreen components before UploadScreen
const authComponents = `
// ============================================================================
// AUTH COMPONENTS
// ============================================================================

function LoginScreen({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    const result = onLogin(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  return (
    <div className="auth-screen fade-in">
      <div className="auth-logo"><Sparkles size={44} color="white" /></div>
      <h1 style={{fontFamily:"'Fredoka',sans-serif",fontSize:'36px',fontWeight:700,background:'linear-gradient(135deg,#3CCFCF,#FF6F61)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'4px'}}>Craftly AI</h1>
      <p style={{fontSize:'15px',color:'#888',marginBottom:'8px'}}>Turn Waste into Wonder ✨</p>
      <div className="eco-badge"><Leaf size={14}/>Eco-Friendly Crafting</div>
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back! 👋</h2>
        <p className="auth-subtitle">Login to access your saved crafts</p>
        {error && <div className="auth-error"><AlertCircle size={16}/>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input type={showPw ? 'text' : 'password'} className="auth-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{paddingRight:'44px'}} />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="auth-switch">Don't have an account? <span className="auth-link" onClick={onSwitchToSignup}>Sign up free</span></div>
      </div>
    </div>
  );
}

function SignupScreen({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password || !confirm) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    const result = onSignup(name.trim(), email.trim().toLowerCase(), password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  return (
    <div className="auth-screen fade-in">
      <div className="auth-logo"><Sparkles size={44} color="white" /></div>
      <h1 style={{fontFamily:"'Fredoka',sans-serif",fontSize:'36px',fontWeight:700,background:'linear-gradient(135deg,#3CCFCF,#FF6F61)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'4px'}}>Craftly AI</h1>
      <p style={{fontSize:'15px',color:'#888',marginBottom:'8px'}}>Turn Waste into Wonder ✨</p>
      <div className="eco-badge"><Leaf size={14}/>Join Eco Crafters!</div>
      <div className="auth-card">
        <h2 className="auth-title">Create Account ��</h2>
        <p className="auth-subtitle">Start your eco-crafting journey today!</p>
        {error && <div className="auth-error"><AlertCircle size={16}/>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input type="text" className="auth-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input type={showPw ? 'text' : 'password'} className="auth-input" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" style={{paddingRight:'44px'}} />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input type={showPw ? 'text' : 'password'} className="auth-input" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <div className="auth-switch">Already have an account? <span className="auth-link" onClick={onSwitchToLogin}>Login</span></div>
      </div>
    </div>
  );
}

`;

// Insert before UploadScreen
code = code.replace(
  "// ============================================================================\n// CHILD COMPONENTS\n// ============================================================================\n\nfunction UploadScreen",
  authComponents + "// ============================================================================\n// CHILD COMPONENTS\n// ============================================================================\n\nfunction UploadScreen"
);

// Also try with \r\n
if (!code.includes('function LoginScreen')) {
  code = code.replace(
    "// ============================================================================\r\n// CHILD COMPONENTS\r\n// ============================================================================\r\n\r\nfunction UploadScreen",
    authComponents + "// ============================================================================\r\n// CHILD COMPONENTS\r\n// ============================================================================\r\n\r\nfunction UploadScreen"
  );
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Components added. Has LoginScreen:', code.includes('function LoginScreen'), 'Lines:', code.split('\n').length);
