
class Component extends DCLogic {
  renderVals() {
    const stBase = 'min-height:44px;padding:0 18px;border-radius:999px;font:600 14px Inter,sans-serif;cursor:pointer;';
    const stOn = stBase + 'border:1px solid #F3F1EA;background:#F3F1EA;color:#141413;';
    const stOff = stBase + 'border:1px solid #34332F;background:#1F1F1D;color:#F3F1EA;';
    const headBase = 'display:flex;justify-content:space-between;align-items:center;padding:14px 16px;';
    const headNew = headBase + 'background:#1E2E45;color:#BBD5F7;';
    const headCook = headBase + 'background:#3A2412;color:#F7CBA0;';
    const headLate = headBase + 'background:#5A211B;color:#FFD0C9;';
    const headReady = headBase + 'background:#173226;color:#B5E6CB;';
    const btnBase = 'width:100%;min-height:52px;border-radius:12px;font:600 15px Inter,sans-serif;cursor:pointer;';
    const btnStart = btnBase + 'border:0;background:#BBD5F7;color:#10253F;';
    const btnDone = btnBase + 'border:0;background:#F7CBA0;color:#3A2412;';
    const btnServe = btnBase + 'border:0;background:#B5E6CB;color:#0E2A1D;';
    const pill = (bg, fg) => 'font-size:13px;font-weight:600;padding:3px 12px;border-radius:999px;background:' + bg + ';color:' + fg + ';';
    return {
      stations: [
        { label: 'All stations', style: stOn },
        { label: 'Tandoor', style: stOff },
        { label: 'Curry', style: stOff },
        { label: 'Cold', style: stOff }
      ],
      columns: [
        {
          title: 'Accepted', count: '3', countStyle: pill('#1E2E45', '#BBD5F7'),
          tickets: [
            { where: 'Table 11', meta: 'Dine-in · 4 guests', timer: '1:20', headStyle: headNew, btn: 'Start cooking', btnStyle: btnStart,
              items: [{ qty: 3, name: 'Masala dosa', note: 'One without onion' }, { qty: 3, name: 'Filter coffee', note: '' }] },
            { where: 'Table 2', meta: 'Dine-in · 4 guests', timer: '2:05', headStyle: headNew, btn: 'Start cooking', btnStyle: btnStart,
              items: [{ qty: 4, name: 'Veg thali', note: 'Extra roti for 1' }] },
            { where: 'Delivery 41', meta: 'Delivery', timer: '3:40', headStyle: headNew, btn: 'Start cooking', btnStyle: btnStart,
              items: [{ qty: 1, name: 'Hyderabadi biryani', note: 'Less spicy' }, { qty: 2, name: 'Gulab jamun', note: '' }] }
          ]
        },
        {
          title: 'Preparing', count: '4', countStyle: pill('#3A2412', '#F7CBA0'),
          tickets: [
            { where: 'Table 4', meta: 'Dine-in · 2 guests', timer: '9:10', headStyle: headCook, btn: 'Mark ready', btnStyle: btnDone,
              items: [{ qty: 2, name: 'Paneer tikka', note: '' }, { qty: 1, name: 'Dal makhani', note: '' }] },
            { where: 'Takeaway 32', meta: 'Takeaway', timer: '6:45', headStyle: headCook, btn: 'Mark ready', btnStyle: btnDone,
              items: [{ qty: 2, name: 'Butter naan', note: '' }, { qty: 1, name: 'Chole', note: 'Pack gravy separately' }] },
            { where: 'Table 9', meta: 'Dine-in · 6 guests', timer: '18:30 · Late', headStyle: headLate, btn: 'Mark ready', btnStyle: btnDone,
              items: [{ qty: 2, name: 'Butter chicken', note: '' }, { qty: 4, name: 'Garlic naan', note: '' }] }
          ]
        },
        {
          title: 'Ready', count: '2', countStyle: pill('#173226', '#B5E6CB'),
          tickets: [
            { where: 'Table 7', meta: 'Dine-in · 4 guests', timer: '14:00', headStyle: headReady, btn: 'Served', btnStyle: btnServe,
              items: [{ qty: 1, name: 'Hyderabadi biryani', note: '' }, { qty: 1, name: 'Raita', note: '' }] },
            { where: 'Table 3', meta: 'Dine-in · 2 guests', timer: '12:15', headStyle: headReady, btn: 'Served', btnStyle: btnServe,
              items: [{ qty: 2, name: 'Masala chai', note: '' }] }
          ]
        }
      ]
    };
  }
}
