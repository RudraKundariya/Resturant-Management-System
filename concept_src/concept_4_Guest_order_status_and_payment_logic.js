
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { waiter: false, bill: false, method: 'upi' };
  }
  renderVals() {
    const inr = (n) => '₹' + n.toLocaleString('en-IN');
    const chip = (bg, fg) => 'font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:' + bg + ';color:' + fg + ';';
    const ST = [
      { label: 'Accepted', c: chip('#E6EFFB', '#123F7A') },
      { label: 'Preparing', c: chip('#FCEBDD', '#8A3B06') },
      { label: 'Ready', c: chip('#DDF0E8', '#0F4F36') },
      { label: 'Served', c: chip('#E6EDEA', '#33423D') }
    ];
    const rows = [
      { qty: 2, name: 'Paneer tikka', price: 280, step: 3 },
      { qty: 1, name: 'Hyderabadi biryani', price: 380, step: 1 },
      { qty: 2, name: 'Butter naan', price: 70, step: 0 },
      { qty: 3, name: 'Masala chai', price: 60, step: 2 }
    ];
    let sub = 0;
    rows.forEach((r) => { sub += r.qty * r.price; });
    const tax = Math.round(sub * 0.05);
    const total = sub + tax;
    const seg = (on) => 'flex:1 1 0;height:6px;border-radius:3px;background:' + (on ? '#145049' : '#DDE5E2') + ';';
    const act = 'min-height:52px;border-radius:12px;font:600 14px Inter,sans-serif;cursor:pointer;';
    const actOff = act + 'border:1px solid #145049;background:#FFFFFF;color:#145049;';
    const actOn = act + 'border:1px solid #145049;background:#145049;color:#FFFFFF;';
    const mb = 'min-height:52px;border-radius:12px;font:600 14px Inter,sans-serif;cursor:pointer;';
    const mOn = mb + 'border:2px solid #145049;background:#E3F1EE;color:#0E3A34;';
    const mOff = mb + 'border:1px solid #BFD0CA;background:#FFFFFF;color:#14211F;';
    const methods = [
      { id: 'upi', label: 'UPI' },
      { id: 'card', label: 'Card' },
      { id: 'cash', label: 'Cash' }
    ];
    const payText = { upi: 'Pay ' + inr(total) + ' with UPI', card: 'Pay ' + inr(total) + ' by card', cash: 'I will pay ' + inr(total) + ' in cash' };
    return {
      items: rows.map((r) => ({
        qty: r.qty,
        name: r.name,
        status: ST[r.step].label,
        chip: ST[r.step].c,
        steps: [0, 1, 2, 3].map((n) => seg(n <= r.step))
      })),
      waiterLabel: this.state.waiter ? 'Waiter notified' : 'Call waiter',
      waiterStyle: this.state.waiter ? actOn : actOff,
      billLabel: this.state.bill ? 'Bill requested' : 'Request bill',
      billStyle: this.state.bill ? actOn : actOff,
      toggleWaiter: () => this.setState({ waiter: !this.state.waiter }),
      toggleBill: () => this.setState({ bill: !this.state.bill }),
      subtotal: inr(sub),
      tax: inr(tax),
      total: inr(total),
      methods: methods.map((m) => ({ label: m.label, on: this.state.method === m.id, style: this.state.method === m.id ? mOn : mOff, pick: () => this.setState({ method: m.id }) })),
      payLabel: payText[this.state.method]
    };
  }
}
