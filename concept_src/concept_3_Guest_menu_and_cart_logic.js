
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { cat: 'Starters', cart: { 'p1': 2, 'm2': 1 } };
  }
  renderVals() {
    const menu = [
      { id: 'p1', cat: 'Starters', name: 'Paneer tikka', desc: 'Charred, mint chutney', price: 280, veg: true },
      { id: 'p2', cat: 'Starters', name: 'Hara bhara kebab', desc: 'Spinach and peas', price: 240, veg: true },
      { id: 'p3', cat: 'Starters', name: 'Chicken 65', desc: 'Curry leaf, chilli', price: 320, veg: false },
      { id: 'm1', cat: 'Mains', name: 'Dal makhani', desc: 'Slow-cooked overnight', price: 300, veg: true },
      { id: 'm2', cat: 'Mains', name: 'Hyderabadi biryani', desc: 'Served with raita', price: 380, veg: false },
      { id: 'm3', cat: 'Mains', name: 'Palak paneer', desc: 'Spinach, cottage cheese', price: 290, veg: true },
      { id: 'b1', cat: 'Breads', name: 'Butter naan', desc: 'Tandoor baked', price: 70, veg: true },
      { id: 'b2', cat: 'Breads', name: 'Garlic naan', desc: 'Garlic, coriander', price: 85, veg: true },
      { id: 'd1', cat: 'Desserts', name: 'Gulab jamun', desc: 'Two pieces, warm', price: 120, veg: true },
      { id: 'd2', cat: 'Desserts', name: 'Kulfi', desc: 'Pistachio', price: 140, veg: true },
      { id: 'r1', cat: 'Drinks', name: 'Masala chai', desc: 'Ginger, cardamom', price: 60, veg: true },
      { id: 'r2', cat: 'Drinks', name: 'Fresh lime soda', desc: 'Sweet or salted', price: 90, veg: true }
    ];
    const IMG = {'p1': '/_blob/cb97d2cca19a82ec8b3b58d4f0a577b1', 'p2': '/_blob/8cd0e500b063328a1b30e27ecf85151d', 'p3': '/_blob/2eddb0c083d84fe8249c9b513d5f57d6', 'm1': '/_blob/2740e031645b525cabe67cc3fd95ae53', 'm2': '/_blob/852b10531dc527610067dcb85002de08', 'm3': '/_blob/db297430fbc2fdf4f624b61e1e404f95', 'b1': '/_blob/5855e1b403321d92f61c6d5783d7d9ef', 'b2': '/_blob/16020bbad9296dc713291afaae3f3815', 'd1': '/_blob/d87401f508720fc7f85b39318efbdd71', 'd2': '/_blob/12a7b5cde2611a53b6f77816e8946754', 'r1': '/_blob/dfb34867f0a72a49b6438303df6f1e83', 'r2': '/_blob/2fa06e825e239114bf3ff0e355828266'};
    const cats = ['Starters', 'Mains', 'Breads', 'Desserts', 'Drinks'];
    const cart = this.state.cart;
    const inr = (n) => '₹' + n.toLocaleString('en-IN');
    const change = (id, d) => {
      const next = Object.assign({}, this.state.cart);
      const q = (next[id] || 0) + d;
      if (q <= 0) { delete next[id]; } else { next[id] = q; }
      this.setState({ cart: next });
    };
    const tb = 'flex:0 0 auto;min-height:44px;padding:0 18px;border-radius:999px;font:600 14px Inter,sans-serif;cursor:pointer;';
    const on = tb + 'border:1px solid #145049;background:#145049;color:#FFFFFF;';
    const off = tb + 'border:1px solid #BFD0CA;background:#FFFFFF;color:#14211F;';
    let count = 0; let total = 0;
    menu.forEach((m) => { if (cart[m.id]) { count += cart[m.id]; total += m.price * cart[m.id]; } });
    const bar = 'box-sizing:border-box;min-height:56px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;font-size:15px;font-weight:600;';
    return {
      cats: cats.map((c) => ({ label: c, selected: this.state.cat === c, style: this.state.cat === c ? on : off, pick: () => this.setState({ cat: c }) })),
      dishes: menu.filter((m) => m.cat === this.state.cat).map((m) => ({
        name: m.name,
        img: IMG[m.id],
        desc: m.desc,
        priceLabel: inr(m.price),
        diet: m.veg ? 'Veg' : 'Non-veg',
        mark: 'width:10px;height:10px;border:2px solid ' + (m.veg ? '#0F6B3A' : '#9A1B10') + ';border-radius:2px;background:' + (m.veg ? '#0F6B3A' : '#9A1B10') + ';',
        inCart: !!cart[m.id],
        qty: cart[m.id] || 0,
        inc: () => change(m.id, 1),
        dec: () => change(m.id, -1)
      })),
      cartStyle: bar + (count ? 'background:#EA580C;color:#1C0A02;' : 'background:#E6EDEA;color:#55655F;'),
      cartLabel: count ? 'View cart · ' + count + (count === 1 ? ' item' : ' items') : 'Your cart is empty',
      cartTotal: count ? inr(total) : ''
    };
  }
}
