// JS for Agrisounds site
(function(){
    const yearE1 = document.getElementById('year');
    if(yearE1){ yearE1.textContent = new Date().getFullYear(); }

    // General nav
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('nav');
    if(toggle && nav){
        toggle.addEventListener('click', () => {
            const open = nav.style.display === 'flex';
            nav.style.display = open ? 'none' : 'flex';
            toggle.setAttribute('aria-expanded', String(!open));
        });
    }

    // Live page (fetch shows)
    if(document.body.dataset.page === 'live'){
        fetch('data/shows.json')
            .then(r => r.json())
            .then(shows => {
                const container = document.getElementById('shows');
                const tpl = document.getElementById('show-item-template');
                if(!Array.isArray(shows) || !container || !tpl) return;
                const upcoming = shows
                    .map(s => ({...s, dateObj:new Date(s.date)}))
                    .filter(s => !isNaN(s.dateObj))
                    .sort((a,b)=>a.dateObj-b.dateObj);

                renderCards(container, tpl, upcoming);

                renderList(document.getElementById('shows-ul'), upcoming);

                const tableBody = document.querySelector('#shows-table tbody');
                renderTable(tableBody, upcoming);
            })
            .catch(err => console.error('Failed to load shows.json', err));
        }

        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        function formatDisplayDate(d) {
            return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        }

        function renderCards(container, tpl, items) {
            container.innerHTML = '';
            for(const s of items){
                const node = tpl.content.cloneNode(true);
                const month = s.dateObj.toLocaleString(undefined,{month:'short'});
                const day = String(s.dateObj.getDate()).padStart(2,'0');
                node.querySelector('.show-month').textContent = month;
                node.querySelector('.show-day').textContent = day;
                node.querySelector('.show-venue').textContent = s.venue || 'TBA';
                node.querySelector('.show-city').textContent = s.city || '—';
                node.querySelector('.show-time').textContent = s.time || '—';
                node.querySelector('.show-price').textContent = s.price || 'Free';
                const a = node.querySelector('.btn');
                if(s.tickets) {
                    a.href = s.tickets;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.setAttribute('aria-label', `Buy tickets for ${s.venue || `TBA`} on ${formatDisplayDate(s.dateObj)}`);
                } else {
                    a.remove();
                }
                container.appendChild(node);
            }
        }

    function renderList(ul, items) {
        if (!ul) return;
        ul.innerHTML = '';
        for (const s of items) {
            const li = document.createElement('li');
            const dateStr = formatDisplayDate(s.dateObj);
            const price = s.price || 'Free';
            const tix = s.tickets ? `<a href="${s.tickets}" target="_blank" rel="noopener noreferrer">Tickets</a>` : '-';
            li.innerHTML = `
                <strong>${dateStr}</strong> - ${s.venue || 'TBA'} (${s.city || '-'}) - ${s.time || '-'} - ${price} - ${tix}
            `;
            ul.appendChild(li);
        }
    }

    function renderTable(tbody, items) {
        if (!tbody) return;
        tbody.innerHTML = '';
        for (const s of items) {
            const tr = document.createElement('tr');
            const dateStr = formatDisplayDate(s.dateObj);
            const price = s.price || 'Free';
            const tix = s.tickets ? `<a href="${s.tickets}" target="_blank" rel="noopener noreferrer">Tickets</a>` : '-';
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${s.venue || 'TBA'}</td>
                <td>${s.city || '-'}</td>
                <td>${s.time || '-'}</td>
                <td>${price}</td>
                <td>${tix}</td>
            `;
            tbody.appendChild(tr);
        }
    }
})();

//Contact form
function handleContactSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const msg = fd.get('message');
    const subject = encodeURIComponent(`Agrisounds booking inquiry from ${name}`);
    const body = encodeURIComponent(`${msg}

From: ${name} <${email}>`);
    window.location.href = `mailto:bikesdakota@gmail.com?subject=${subject}&body=${body}`;
    return false;

}
