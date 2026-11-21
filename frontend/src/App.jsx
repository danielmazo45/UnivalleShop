import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, UserRound, Plus, ArrowRight, Package, ClipboardList, ShieldCheck, School, X, Minus, ChevronRight, SlidersHorizontal, Sparkles, Heart, CheckCircle2, AlertCircle, RefreshCw, Menu, Truck, LockKeyhole, Store, Boxes, LogOut } from 'lucide-react';

const fmt = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n) || 0);
const api = async (route, init) => {
  const response = await fetch(`/api${route}`, { headers: { 'Content-Type': 'application/json' }, ...init });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join('. ') : (data?.message || `Error HTTP ${response.status}`);
    throw new Error(msg);
  }
  return data;
};
const getId = obj => obj?.id || obj?._id;
const thumbnailColors = ['#ecede2','#e9f0f0','#e9e5da','#f0e9e1','#e3e9ee','#e9e5ed'];
const emojiFor = (p) => {
  const t = `${p.category || ''} ${p.name || ''}`.toLowerCase();
  if (/libro|cuaderno|papeler|lapiz|boligraf|agenda/.test(t)) return '📚';
  if (/tecnolog|comput|teclado|mouse|audio|auricul/.test(t)) return '💻';
  if (/ropa|camiseta|buzo|chaqueta|moda/.test(t)) return '👕';
  if (/bebida|café|comida|snack/.test(t)) return '☕';
  if (/mochila|bolso|maleta/.test(t)) return '🎒';
  return '🛍️';
};
function ProductArt({ product, index = 0 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.imageUrl]);
  return <div className="product-art" style={{ background: thumbnailColors[index % thumbnailColors.length] }}>
    {product.imageUrl && !failed ? <img src={product.imageUrl} alt={product.name} onError={() => setFailed(true)} /> : <span aria-hidden="true">{emojiFor(product)}</span>}
  </div>;
}
function App() {
  const [view, setView] = useState('shop');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [register, setRegister] = useState({ name: '', email: '', password: '' });
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [regBusy, setRegBusy] = useState(false);
  const [regError, setRegError] = useState('');
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  const [productBusy, setProductBusy] = useState(false);
  const [productError, setProductError] = useState('');
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  const notify = msg => { setToast(msg); window.setTimeout(() => setToast(''), 4000); };
  const loadProducts = async () => {
    setLoading(true); setError('');
    try { const data = await api('/products'); setProducts(Array.isArray(data) ? data : []); }
    catch (e) { setError(`No se pudo consultar el catálogo: ${e.message}`); }
    finally { setLoading(false); }
  };
  const loadOrders = async () => {
    try { const data = await api('/orders'); setOrders(Array.isArray(data) ? data : []); }
    catch (e) { notify(`No se pudieron consultar pedidos: ${e.message}`); }
  };
  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (view === 'admin') loadOrders(); }, [view]);
  const categories = useMemo(() => ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);
  const visible = useMemo(() => products.filter(p => (category === 'Todos' || p.category === category) && (`${p.name} ${p.description || ''} ${p.category}`.toLowerCase().includes(search.toLowerCase()))), [products, search, category]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  const addToCart = p => {
    if (Number(p.stock) <= 0) return notify('Este producto está agotado');
    setCart(prev => {
      const existing = prev.find(i => getId(i) === getId(p));
      if (existing) return prev.map(i => getId(i) === getId(p) ? { ...i, quantity: Math.min(i.quantity + 1, Number(p.stock)) } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    notify('Producto agregado al carrito');
  };
  const changeQty = (id, delta) => setCart(prev => prev.map(i => getId(i) === id ? { ...i, quantity: Math.max(0, Math.min(i.quantity + delta, Number(i.stock))) } : i).filter(i => i.quantity > 0));
  const submitRegister = async e => {
    e.preventDefault(); setRegBusy(true); setRegError('');
    try {
      const data = await api('/users', { method: 'POST', body: JSON.stringify(register) });
      setUser({ id: getId(data), name: data.name, email: data.email });
      setAuthOpen(false); setRegister({ name: '', email: '', password: '' });
      notify('Usuario registrado. Registro de demostración completado.');
    } catch (e) { setRegError(e.message); }
    finally { setRegBusy(false); }
  };
  const submitLogin = async e => {
    e.preventDefault(); setLoginBusy(true); setLoginError('');
    try {
      const data = await api('/users/login', { method: 'POST', body: JSON.stringify(login) });
      setUser({ id: getId(data), name: data.name, email: data.email });
      setAuthOpen(false);
      setLogin({ email: '', password: '' });
      notify('Credenciales verificadas. Acceso de demostración iniciado.');
    } catch (e) { setLoginError(e.message); }
    finally { setLoginBusy(false); }
  };
  const submitProduct = async e => {
    e.preventDefault(); setProductBusy(true); setProductError('');
    try {
      const data = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
      if (!data.imageUrl?.trim()) delete data.imageUrl;
      await api('/products', { method: 'POST', body: JSON.stringify(data) });
      setProductForm({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
      await loadProducts(); notify('Producto publicado en el catálogo');
    } catch (e) { setProductError(e.message); }
    finally { setProductBusy(false); }
  };
  const checkout = async () => {
    if (!user?.id) { setCartOpen(false); setAuthOpen(true); return; }
    if (!cart.length) return;
    setOrderBusy(true); setOrderError('');
    try {
      const data = await api('/orders', { method: 'POST', body: JSON.stringify({ userId: user.id, items: cart.map(i => ({ productId: String(getId(i)), quantity: i.quantity, unitPrice: Number(i.price) })) }) });
      setOrderSuccess(data); setCart([]); setCartOpen(false); setView('success'); notify('Pedido de demostración creado');
    } catch (e) { setOrderError(e.message); }
    finally { setOrderBusy(false); }
  };
  const nav = next => { setView(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <>
    <div className="announcement"><span className="announcement-dot"/> Proyecto universitario · Versión de demostración <span className="announcement-right">Hecho para la comunidad Univalle <ArrowRight size={13}/></span></div>
    <header className="header"><div className="page-container header-inner">
      <button className="brand" onClick={() => nav('shop')} aria-label="Inicio UnivalleShop"><span className="brand-mark"><ShoppingBag size={23} strokeWidth={2.3}/></span><span>univalle<span className="brand-accent">shop</span><small>TIENDA UNIVERSITARIA</small></span></button>
      <nav className={`nav ${mobileOpen ? 'mobile-visible' : ''}`}><button className={view === 'shop' ? 'active' : ''} onClick={() => nav('shop')}>Explorar tienda</button><button className={view === 'admin' ? 'active' : ''} onClick={() => nav('admin')}>Administración <span className="admin-chip">Demo</span></button></nav>
      <div className="header-actions"><button className="icon-button desktop-search" aria-label="Buscar productos" onClick={() => {nav('shop');document.getElementById('search')?.focus();}}><Search size={21}/></button><button className="user-button" onClick={() => setAuthOpen(true)}><UserRound size={19}/><span>{user ? user.name.split(' ')[0] : 'Iniciar sesión'}</span></button><button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Carrito, ${count} artículos`}><ShoppingCart size={21}/>{count > 0 && <b>{count}</b>}</button><button className="icon-button mobile-menu" aria-label="Abrir menú" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={22}/></button></div>
    </div></header>
    {view === 'shop' && <main>
      <section className="hero"><div className="page-container hero-layout">
        <div className="hero-copy"><div className="eyebrow"><span className="line"/> UNA TIENDA PARA TU CAMPUS</div><h1>Todo lo que necesitas,<br/><em>más cerca de ti.</em></h1><p>Descubre productos para estudiar, crear y vivir tu día a día en la universidad. Un espacio pensado para la comunidad Univalle.</p><button className="primary-button" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>Explorar productos <ArrowRight size={19}/></button><div className="hero-foot"><span><CheckCircle2 size={17}/> Comunidad universitaria</span><span><CheckCircle2 size={17}/> Catálogo en tiempo real</span></div></div>
        <div className="hero-visual"><div className="circle c1"/><div className="circle c2"/><div className="hero-main-shape"><div className="book book-back"/><div className="book book-front"><div className="book-symbol">U<span>V</span></div><div className="book-caption">APRENDER · CREAR · CRECER</div></div><div className="cup"><span>☕</span></div></div><div className="float-tag"><Sparkles size={17}/> Tu espacio universitario</div><div className="hero-serial">UNIVALLE / COLLECTION 01</div></div>
      </div></section>
      <section className="perks page-container"><div><School size={24}/><span><strong>Pensado para Univalle</strong><small>Una comunidad, muchas ideas</small></span></div><div><Package size={24}/><span><strong>Productos universitarios</strong><small>Lo que necesitas en un lugar</small></span></div><div><ShieldCheck size={24}/><span><strong>Proyecto académico</strong><small>Una experiencia en desarrollo</small></span></div></section>
      <section className="catalog page-container" id="catalogo"><div className="section-heading"><div><div className="eyebrow dark"><span className="line"/> NUESTRO CATÁLOGO</div><h2>Encuentra algo para ti<span className="accent-dot">.</span></h2><p>Explora los productos publicados en nuestra tienda universitaria.</p></div><button className="refresh-button" onClick={loadProducts}><RefreshCw size={16}/> Actualizar</button></div>
        <div className="catalog-controls"><div className="search-box"><Search size={19}/><input id="search" placeholder="Buscar productos, categorías..." value={search} onChange={e => setSearch(e.target.value)}/>{search && <button onClick={() => setSearch('')} aria-label="Limpiar búsqueda"><X size={16}/></button>}</div><div className="category-list"><SlidersHorizontal size={17}/>{categories.map(c => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
        {error && <div className="error-state"><AlertCircle size={22}/><span>{error}. Verifica que Docker y los servicios estén activos.</span><button onClick={loadProducts}>Reintentar</button></div>}
        {loading ? <div className="product-grid">{[1,2,3,4].map(n => <div key={n} className="skeleton-card"><div/><span/><small/></div>)}</div> : visible.length ? <div className="product-grid">{visible.map((p,i) => <article className="product-card" key={getId(p) || i}><div className="product-image-wrap"><ProductArt product={p} index={i}/><div className="product-badge">{p.stock > 0 ? 'Disponible' : 'Agotado'}</div></div><div className="product-info"><div className="product-cat">{p.category || 'General'}</div><h3>{p.name}</h3><p className="product-desc">{p.description || 'Producto de nuestra comunidad'}</p><div className="product-bottom"><div><strong>{fmt(p.price)}</strong><small>{p.stock} unidades</small></div><button onClick={() => addToCart(p)} disabled={p.stock <= 0} aria-label={`Agregar ${p.name} al carrito`}><Plus size={19}/></button></div></div></article>)}</div> : <div className="empty-products"><div className="empty-symbol"><Boxes size={34}/></div><h3>{products.length ? 'No encontramos productos' : 'La tienda está preparando su catálogo'}</h3><p>{products.length ? 'Prueba con otra búsqueda o categoría.' : 'Aún no hay productos registrados. Puedes añadir los primeros desde Administración.'}</p><button className="secondary-button" onClick={() => products.length ? (setSearch(''),setCategory('Todos')) : nav('admin')}>{products.length ? 'Ver todos' : 'Agregar productos'} <ArrowRight size={16}/></button></div>}
      </section>
      <section className="bottom-banner"><div className="page-container banner-inner"><div><div className="eyebrow">COMUNIDAD QUE CREA</div><h2>Ideas que nacen<br/>en el campus.</h2><p>UnivalleShop es una demostración académica de una tienda construida con microservicios.</p></div><div className="banner-mark">UV<span>.</span></div></div></section>
    </main>}
    {view === 'admin' && <main className="admin-page page-container"><div className="admin-intro"><div><div className="eyebrow dark"><span className="line"/> PANEL DE DEMOSTRACIÓN</div><h1>Administración<span className="accent-dot">.</span></h1><p>Registra productos de prueba y consulta pedidos de los microservicios.</p></div><span className="demo-pill"><AlertCircle size={16}/> Sin autenticación de administradores</span></div><div className="stat-grid"><div className="stat"><Package size={24}/><div><b>{products.length}</b><span>Productos en catálogo</span></div></div><div className="stat"><ClipboardList size={24}/><div><b>{orders.length}</b><span>Pedidos registrados</span></div></div><div className="stat"><Store size={24}/><div><b>3</b><span>Microservicios backend</span></div></div></div><div className="admin-grid"><section className="admin-panel"><div className="panel-title"><div><h2>Nuevo producto</h2><p>Se almacenará en el microservicio de catálogo.</p></div><Plus size={23}/></div><form className="form" onSubmit={submitProduct}><label>Nombre del producto<input required minLength={2} placeholder="Ej. Cuaderno universitario" value={productForm.name} onChange={e => setProductForm({...productForm,name:e.target.value})}/></label><label>Descripción<textarea required rows="3" placeholder="Detalles del producto..." value={productForm.description} onChange={e => setProductForm({...productForm,description:e.target.value})}/></label><div className="form-row"><label>Precio (COP)<input required min="0" step="100" type="number" placeholder="12000" value={productForm.price} onChange={e => setProductForm({...productForm,price:e.target.value})}/></label><label>Existencias<input required min="0" step="1" type="number" placeholder="10" value={productForm.stock} onChange={e => setProductForm({...productForm,stock:e.target.value})}/></label></div><label>Categoría<input required minLength={2} placeholder="Ej. Papelería" value={productForm.category} onChange={e => setProductForm({...productForm,category:e.target.value})}/></label><label>URL de imagen (opcional)<input type="url" placeholder="https://ejemplo.com/foto.jpg" value={productForm.imageUrl} onChange={e => setProductForm({...productForm,imageUrl:e.target.value})}/></label>{productError && <div className="form-error"><AlertCircle size={15}/>{productError}</div>}<button className="primary-button form-submit" disabled={productBusy}>{productBusy?'Publicando...':'Publicar producto'} <ArrowRight size={18}/></button></form></section><section className="admin-panel"><div className="panel-title"><div><h2>Pedidos recientes</h2><p>Información en tiempo real del servicio de pedidos.</p></div><button className="icon-button" title="Actualizar pedidos" onClick={loadOrders}><RefreshCw size={20}/></button></div>{orders.length ? <div className="order-list">{orders.slice().reverse().map((o,i) => <div className="order-item" key={getId(o)||i}><div><b>Pedido #{String(getId(o) || i + 1).slice(0,8)}</b><span>{o.items?.length||0} producto(s) · {o.status || 'pending'}</span></div><strong>{fmt(o.total)}</strong></div>)}</div>:<div className="empty-orders"><ClipboardList size={32}/><h3>Sin pedidos todavía</h3><p>Los pedidos realizados desde el carrito aparecerán aquí.</p></div>}<div className="admin-note"><LockKeyhole size={18}/><p>Este panel es únicamente para pruebas. En una tienda real se debe proteger con autenticación y permisos de administrador.</p></div></section></div></main>}
    {view === 'success' && <main className="success-page page-container"><div className="success-card"><div className="success-symbol"><CheckCircle2 size={48}/></div><div className="eyebrow dark">PEDIDO CREADO</div><h1>¡Tu pedido está registrado!</h1><p>El servicio de pedidos guardó una orden de demostración. No se ha realizado ningún cobro ni se ha reservado inventario.</p><div className="success-details"><span>Identificador</span><b>{String(getId(orderSuccess) || 'Generado por servicio')}</b><span>Estado</span><b>{orderSuccess?.status || 'pending'}</b><span>Total informado</span><b>{fmt(orderSuccess?.total)}</b></div><button className="primary-button" onClick={() => nav('shop')}>Volver a la tienda <ArrowRight size={18}/></button></div></main>}
    <footer className="footer"><div className="page-container footer-inner"><div className="footer-brand"><span className="brand-mark"><ShoppingBag size={20}/></span><span>univalleshop</span></div><span>Proyecto académico · Universidad del Valle</span><span>React · NestJS · MongoDB · Docker</span></div></footer>
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    {cartOpen && <div className="overlay" onMouseDown={e => { if(e.target === e.currentTarget) setCartOpen(false); }}><aside className="drawer" role="dialog" aria-label="Carrito"><div className="drawer-head"><div><h2>Tu carrito</h2><p>{count} artículos seleccionados</p></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Cerrar"><X/></button></div><div className="drawer-body">{cart.length?cart.map((p,i)=><div className="cart-item" key={getId(p)}><div className="cart-thumb"><ProductArt product={p} index={i}/></div><div className="cart-info"><strong>{p.name}</strong><span>{fmt(p.price)}</span><div className="qty"><button onClick={() => changeQty(getId(p),-1)} aria-label="Reducir"><Minus size={14}/></button><b>{p.quantity}</b><button onClick={() => changeQty(getId(p),1)} aria-label="Aumentar"><Plus size={14}/></button></div></div><b>{fmt(p.quantity*p.price)}</b></div>):<div className="empty-cart"><ShoppingCart size={38}/><h3>Tu carrito está vacío</h3><p>Explora los productos y añade lo que te guste.</p><button className="secondary-button" onClick={() => setCartOpen(false)}>Seguir explorando</button></div>}</div>{cart.length>0 && <div className="drawer-bottom"><div className="subtotal"><span>Total</span><b>{fmt(total)}</b></div><p>Pedido de prueba: no hay pagos ni entrega real.</p>{orderError && <div className="form-error">{orderError}</div>}<button className="primary-button checkout" disabled={orderBusy} onClick={checkout}>{orderBusy?'Registrando pedido...':user?'Crear pedido de prueba':'Registrarme para continuar'} <ArrowRight size={17}/></button></div>}</aside></div>}
    {authOpen && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setAuthOpen(false); }}>
      <div className="auth-modal" role="dialog" aria-label="Acceso de usuario">
        <button className="modal-close icon-button" onClick={() => setAuthOpen(false)} aria-label="Cerrar"><X/></button>
        {user ? <>
          <div className="auth-icon"><UserRound size={25}/></div>
          <h2>Perfil de demostración</h2>
          <p>Acceso local verificado mediante correo y contraseña. No hay todavía sesiones con tokens ni autorización de roles.</p>
          <div className="profile-details"><b>{user.name}</b><span>{user.email}</span><small>ID: {user.id}</small></div>
          <button className="secondary-button full" onClick={() => { setUser(null); setAuthOpen(false); }}><LogOut size={16}/> Salir de esta pantalla</button>
        </> : authMode === 'login' ? <>
          <div className="auth-icon"><UserRound size={25}/></div>
          <h2>Iniciar sesión</h2>
          <p>Accede con el correo institucional y la contraseña que registraste.</p>
          <form className="form" onSubmit={submitLogin}>
            <label>Correo institucional<input required type="email" autoComplete="username" placeholder="nombre@correounivalle.edu.co" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })}/></label>
            <label>Contraseña<input required type="password" autoComplete="current-password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })}/></label>
            {loginError && <div className="form-error"><AlertCircle size={15}/>{loginError}</div>}
            <button className="primary-button form-submit" disabled={loginBusy}>{loginBusy ? 'Verificando...' : 'Entrar'} <ArrowRight size={17}/></button>
          </form>
          <button type="button" className="secondary-button full" style={{marginTop: 14}} onClick={() => { setAuthMode('register'); setLoginError(''); }}>¿No tienes cuenta? Regístrate</button>
          <div className="auth-disclaimer"><AlertCircle size={17}/> Acceso académico: comprueba la contraseña, pero no emite un token de sesión ni protege todavía los pedidos y la administración.</div>
        </> : <>
          <div className="auth-icon"><School size={25}/></div>
          <h2>Crear una cuenta</h2>
          <p>Regístrate con un correo institucional de Univalle.</p>
          <form className="form" onSubmit={submitRegister}>
            <label>Nombre completo<input required minLength={2} placeholder="Tu nombre" autoComplete="name" value={register.name} onChange={e => setRegister({ ...register, name: e.target.value })}/></label>
            <label>Correo institucional<input required type="email" placeholder="nombre@correounivalle.edu.co" autoComplete="email" value={register.email} onChange={e => setRegister({ ...register, email: e.target.value })}/></label>
            <label>Contraseña<input required minLength={8} type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={register.password} onChange={e => setRegister({ ...register, password: e.target.value })}/></label>
            {regError && <div className="form-error"><AlertCircle size={15}/>{regError}</div>}
            <button className="primary-button form-submit" disabled={regBusy}>{regBusy ? 'Registrando...' : 'Crear usuario'} <ArrowRight size={17}/></button>
          </form>
          <button type="button" className="secondary-button full" style={{marginTop: 14}} onClick={() => { setAuthMode('login'); setRegError(''); }}>¿Ya tienes cuenta? Inicia sesión</button>
          <div className="auth-disclaimer"><AlertCircle size={17}/> Registro demostrativo. No envía correos de verificación ni concede permisos de administrador.</div>
        </>}
      </div>
    </div>}
  </>;
}
export default App;
