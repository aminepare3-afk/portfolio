/* ══════════════════════════════════════
   PROJECTS.JS — Charge depuis Supabase
══════════════════════════════════════ */
const SB_URL = 'https://ytpghkntnuuppmreeboo.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cGdoa250bnV1cHBtcmVlYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTY5NzEsImV4cCI6MjA5Nzc5Mjk3MX0.D4i-P18kRs0_nsMX5Kk8EYdnTV-ZIxDVfI_OvoAmE4E';

async function fetchProjects() {
  const res = await fetch(
    `${SB_URL}/rest/v1/projects?select=*&order=position.asc,created_at.asc`,
    { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
  );
  if (!res.ok) throw new Error('Erreur Supabase: ' + res.status);
  return res.json();
}

function hexToRgb(hex) {
  try {
    return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
  } catch { return '255,77,0'; }
}

function buildCard(p) {
  const color  = p.color || '#FF4D00';
  const desc   = p.description || '';
  const hasImg = !!p.img;

  const thumb = hasImg
    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block"/>`
    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;position:relative;z-index:1">
        ${p.emoji
          ? `<span style="font-size:3rem">${p.emoji}</span>`
          : `<span style="font-family:'Bebas Neue',sans-serif;font-size:2.6rem;color:${color};text-shadow:0 0 30px ${color}55;padding:0 1rem;text-align:center;line-height:1">${p.name.toUpperCase()}</span>`
        }
       </div>`;

  const bgStyle = hasImg ? '' : `background:linear-gradient(135deg,#080808 0%,rgba(${hexToRgb(color)},.08) 60%,#0a0a0a 100%)`;

  const tags = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');

  const linkHtml = p.url
    ? `<a href="${p.url}" target="_blank" rel="noopener" class="project-link">
         Voir le projet
         <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </a>`
    : '';

  const badge = p.featured
    ? `<div style="position:absolute;top:.8rem;right:.8rem;background:${color};color:#000;font-family:'DM Mono',monospace;font-size:.54rem;letter-spacing:.12em;text-transform:uppercase;padding:.25rem .65rem;z-index:2">★ Vedette</div>`
    : '';

  return `
    <div class="project-card ${p.size || 'wide'} rv" data-project-id="${p.id}">
      <div class="project-no-img" style="${bgStyle};position:relative">
        ${thumb}${badge}
      </div>
      <div class="project-info">
        ${tags ? `<div class="project-tags">${tags}</div>` : ''}
        <h3 class="project-name">${p.name}</h3>
        <p class="project-desc">${desc}</p>
        ${linkHtml}
      </div>
    </div>`;
}

async function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const projects = await fetchProjects();

    // Vider le grid (enlève les skeletons)
    grid.innerHTML = '';

    if (!projects.length) {
      grid.innerHTML = `
        <div class="projects-empty">
          <div class="projects-empty-icon">🚀</div>
          <div class="projects-empty-txt">Les projets arrivent bientôt...</div>
        </div>`;
      return;
    }

    // Injecter les cartes
    grid.innerHTML = projects.map(buildCard).join('');

    // Animations reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i * 80);
      });
    }, { threshold: 0.07 });
    grid.querySelectorAll('.rv').forEach(el => io.observe(el));

  } catch (err) {
    console.error('Erreur chargement projets:', err);
    grid.innerHTML = `
      <div class="projects-empty">
        <div class="projects-empty-icon">⚠️</div>
        <div class="projects-empty-txt">Impossible de charger les projets</div>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', renderProjects);
