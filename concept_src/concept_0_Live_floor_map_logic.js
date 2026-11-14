
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { filter: 'all' };
  }
  renderVals() {
    const navBase = 'min-height:44px;padding:0 16px;border-radius:10px;font-size:14px;font-weight:500;display:flex;align-items:center;';
    const navOn = navBase + 'background:#FFFFFF;color:#145049;font-weight:600;';
    const navOff = navBase + 'color:#DDF3EE;';
    const S = {
      empty: { label: 'Empty', bg: '#FFFFFF', bd: '1px solid #9DB8B0', fg: '#14211F', sub: '#55655F', chipBg: '#DDF0E8', chipFg: '#0F4F36' },
      occupied: { label: 'Occupied', bg: '#FDECEA', bd: '1px solid #EDB0A8', fg: '#14211F', sub: '#55655F', chipBg: '#F8CFC9', chipFg: '#8F1A0F' },
      cleaning: { label: 'Needs cleaning', bg: '#E6EFFB', bd: '1px solid #A9C4EA', fg: '#14211F', sub: '#4A5A66', chipBg: '#CFE0F7', chipFg: '#123F7A' },
      attention: { label: 'Needs attention', bg: '#B93C08', bd: '1px solid #B93C08', fg: '#FFFFFF', sub: '#FFE6D8', chipBg: '#FFFFFF', chipFg: '#8A2E05' }
    };
    const data = [
      { n: 'Table 1', seats: 2, st: 'empty', note: 'Free', timer: '', span: 1 },
      { n: 'Table 2', seats: 4, st: 'occupied', note: '4 guests', timer: '12 min', span: 1 },
      { n: 'Table 3', seats: 2, st: 'occupied', note: '2 guests', timer: '38 min', span: 1 },
      { n: 'Table 4', seats: 4, st: 'occupied', note: '2 guests', timer: '41 min', span: 1 },
      { n: 'Table 5', seats: 6, st: 'attention', note: 'Guest called waiter · 2 min', timer: '52 min', span: 2 },
      { n: 'Table 6', seats: 4, st: 'cleaning', note: 'Waiting 3 min', timer: '', span: 1 },
      { n: 'Table 7', seats: 4, st: 'attention', note: 'Bill requested · long stay', timer: '1 h 05', span: 1 },
      { n: 'Table 8', seats: 2, st: 'empty', note: 'Free', timer: '', span: 1 },
      { n: 'Table 9', seats: 6, st: 'attention', note: 'Order delayed 9 min · 6 guests', timer: '49 min', span: 2 },
      { n: 'Table 10', seats: 8, st: 'empty', note: 'Free', timer: '', span: 2 },
      { n: 'Table 11', seats: 4, st: 'occupied', note: '4 guests', timer: '6 min', span: 1 },
      { n: 'Table 12', seats: 2, st: 'cleaning', note: 'Waiting 1 min', timer: '', span: 1 }
    ];
    const f = this.state.filter;
    const counts = { all: data.length };
    Object.keys(S).forEach((k) => { counts[k] = data.filter((d) => d.st === k).length; });
    const fBase = 'min-height:44px;padding:0 16px;border-radius:999px;font:600 13px Inter,sans-serif;cursor:pointer;';
    const fOn = fBase + 'border:1px solid #145049;background:#145049;color:#FFFFFF;';
    const fOff = fBase + 'border:1px solid #BFD0CA;background:#FFFFFF;color:#14211F;';
    const keys = ['all', 'empty', 'occupied', 'cleaning', 'attention'];
    return {
      nav: [
        { label: 'Floor', href: 'Main.dc.html', style: navOn },
        { label: 'Kitchen', href: 'Kitchen.dc.html', style: navOff },
        { label: 'Cleaning', href: 'Tasks.dc.html', style: navOff },
        { label: 'Reports', href: 'Reports.dc.html', style: navOff },
        { label: 'Menu', href: '#', style: navOff },
        { label: 'Staff', href: '#', style: navOff }
      ],
      filters: keys.map((k) => ({
        label: (k === 'all' ? 'All' : S[k].label) + ' · ' + counts[k],
        on: f === k,
        style: f === k ? fOn : fOff,
        pick: () => this.setState({ filter: k })
      })),
      tables: data.map((d) => {
        const s = S[d.st];
        const dim = (f !== 'all' && f !== d.st) ? 'opacity:0.35;' : '';
        return {
          name: d.n,
          seats: d.seats,
          state: s.label,
          note: d.note,
          timer: d.timer,
          card: 'box-sizing:border-box;min-height:132px;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px;grid-column:span ' + d.span + ';background:' + s.bg + ';border:' + s.bd + ';color:' + s.fg + ';' + dim,
          sub: 'font-size:13px;color:' + s.sub + ';',
          chip: 'align-self:flex-start;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:' + s.chipBg + ';color:' + s.chipFg + ';'
        };
      }),
      alerts: [
        { title: 'Table 5 · Call waiter', detail: 'Guest tapped 2 min ago' },
        { title: 'Table 7 · Bill requested', detail: 'Waiting 1 min · seated 1 h 05' },
        { title: 'Table 9 · Order delayed', detail: 'Butter chicken, 9 min over estimate' }
      ],
      waitlist: [
        { name: 'Mehta', size: 6, wait: '8 min' },
        { name: 'Iyer', size: 2, wait: '3 min' }
      ]
    };
  }
}
