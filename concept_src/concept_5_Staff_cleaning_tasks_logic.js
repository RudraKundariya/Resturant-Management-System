
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { done: {} };
  }
  renderVals() {
    const all = [
      { id: 'c1', name: 'Table 6', seats: 4, wait: '3 min', after: 'Paid by UPI', late: true },
      { id: 'c2', name: 'Table 12', seats: 2, wait: '1 min', after: 'Paid by card', late: false },
      { id: 'c3', name: 'Table 3', seats: 2, wait: 'Just now', after: 'Paid in cash', late: false }
    ];
    const open = all.filter((t) => !this.state.done[t.id]);
    const chip = (bg, fg) => 'font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:' + bg + ';color:' + fg + ';';
    return {
      count: open.length,
      allDone: open.length === 0,
      tasks: open.map((t) => ({
        name: t.name,
        priority: t.late ? 'Waiting longest' : 'Next',
        chip: t.late ? chip('#FCEBDD', '#8A3B06') : chip('#E6EFFB', '#123F7A'),
        detail: t.seats + ' seats · ' + t.after + ' · waiting ' + t.wait,
        card: 'background:#FFFFFF;border:' + (t.late ? '2px solid #B93C08' : '1px solid #DDE5E2') + ';border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;',
        done: () => { const d = Object.assign({}, this.state.done); d[t.id] = true; this.setState({ done: d }); }
      }))
    };
  }
}
