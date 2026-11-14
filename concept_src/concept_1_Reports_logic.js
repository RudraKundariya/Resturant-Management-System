
class Component extends DCLogic {
  renderVals() {
    const navBase = 'min-height:44px;padding:0 16px;border-radius:10px;font-size:14px;font-weight:500;display:flex;align-items:center;';
    const navOn = navBase + 'background:#FFFFFF;color:#145049;font-weight:600;';
    const navOff = navBase + 'color:#DDF3EE;';
    const chip = (bg, fg) => 'font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:' + bg + ';color:' + fg + ';white-space:nowrap;';
    const good = chip('#DDF0E8', '#0F4F36');
    const low = chip('#FCEBDD', '#8A3B06');
    const peak = [18, 26, 34, 28, 22, 20, 30, 52, 78, 100, 84, 46];
    const labels = ['11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const dw = [
      { name: 'Table 1', m: 42 }, { name: 'Table 2', m: 55 }, { name: 'Table 3', m: 38 },
      { name: 'Table 4', m: 64 }, { name: 'Table 5', m: 78 }, { name: 'Table 7', m: 69 },
      { name: 'Table 9', m: 82 }, { name: 'Table 10', m: 91 }
    ];
    return {
      nav: [
        { label: 'Floor', href: 'Main.dc.html', style: navOff },
        { label: 'Kitchen', href: 'Kitchen.dc.html', style: navOff },
        { label: 'Cleaning', href: 'Tasks.dc.html', style: navOff },
        { label: 'Reports', href: 'Reports.dc.html', style: navOn },
        { label: 'Menu', href: '#', style: navOff },
        { label: 'Staff', href: '#', style: navOff }
      ],
      kpis: [
        { label: 'Orders placed via QR', value: '74%', target: 'at least 70%', status: 'Meets target', chip: good },
        { label: 'Average table turnover time', value: '-12%', target: 'reduce by 15%', status: 'Below target', chip: low },
        { label: 'Guest leaves to table ready', value: '4 min 10 s', target: 'under 5 minutes', status: 'Meets target', chip: good },
        { label: 'Alert acknowledge time', value: '112 s', target: 'under 90 seconds', status: 'Below target', chip: low },
        { label: 'Order accuracy', value: '98.6%', target: 'at least 98%', status: 'Meets target', chip: good },
        { label: 'Online payment success', value: '96.4%', target: 'at least 97%', status: 'Below target', chip: low }
      ],
      bars: peak.map((v, i) => ({ h: v + '%', label: labels[i], fill: v === 100 ? '#EA580C' : '#145049' })),
      sellers: [
        { name: 'Hyderabadi biryani', n: 64, w: '100%' },
        { name: 'Butter chicken', n: 52, w: '81%' },
        { name: 'Paneer tikka', n: 47, w: '73%' },
        { name: 'Masala chai', n: 39, w: '61%' },
        { name: 'Garlic naan', n: 31, w: '48%' }
      ],
      dwell: dw.map((d) => ({
        name: d.name,
        t: Math.floor(d.m / 60) ? Math.floor(d.m / 60) + ' h ' + (d.m % 60) + ' m' : d.m + ' min',
        w: Math.round((d.m / 100) * 100) + '%',
        fill: d.m > 60 ? '#B93C08' : '#145049'
      }))
    };
  }
}
