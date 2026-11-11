import { project } from '../data/project.js';
import { team } from '../data/team.js';
import { icon } from './icons.js';
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node; };
function safeUrl(value, email = false) { try { const url = new URL(value, document.baseURI); return (['https:', 'http:'].includes(url.protocol) || (email && url.protocol === 'mailto:')) ? url.href : null; } catch { return null; } }
function link(url, label, className = '', symbol) {
  const node = el('a', className, label); const href = safeUrl(url, true);
  if (!href) return null;
  node.href = href; if (!href.startsWith('mailto:')) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
  if (symbol) node.append(icon(symbol)); return node;
}
document.querySelectorAll('[data-icon]').forEach(node => node.append(icon(node.dataset.icon)));
document.querySelectorAll('[data-logo]').forEach(node => node.src = project.logo);
document.querySelectorAll('[data-project-github]').forEach(node => { node.href = project.github; node.target = '_blank'; node.rel = 'noopener noreferrer'; });
document.querySelectorAll('[data-project-issues]').forEach(node => { node.href = project.github + '/issues'; node.target = '_blank'; node.rel = 'noopener noreferrer'; });
document.querySelector('#year').textContent = new Date().getFullYear();
for (const member of team) {
  const card = el('article', 'team-card reveal'); const initials = member.name.split(' ').filter(word => !['dos', 'de', 'da'].includes(word)).slice(0, 2).map(word => word[0]).join('');
  if (member.photo) { const photo = el('img', 'avatar'); photo.src = member.photo; photo.alt = member.name; photo.width = photo.height = 64; photo.loading = 'lazy'; card.append(photo); }
  else card.append(el('div', 'avatar', initials));
  card.append(el('h3', '', member.name)); if (member.role) card.append(el('p', 'member-role', member.role));
  const socials = el('div', 'social-links');
  for (const [platform, url] of Object.entries(member.links || {})) { if (!url) continue; const social = link(url, '', '', platform); if (social) { social.setAttribute('aria-label', `${platform === 'github' ? 'GitHub' : platform === 'linkedin' ? 'LinkedIn' : 'Portfólio'} de ${member.name}`); socials.append(social); } }
  if (member.email) { const email = link('mailto:' + member.email, '', '', 'mail'); if (email) { email.setAttribute('aria-label', `E-mail de ${member.name}`); socials.append(email); } }
  if (socials.children.length) card.append(socials); document.querySelector('#team-grid').append(card);
}
for (const repo of project.repositories) {
  const card = el('article', 'repository-card reveal'); const top = el('div', 'card-top'); top.append(icon(repo.icon), el('span', 'repo-label', 'REPOSITÓRIO PÚBLICO')); card.append(top, el('h3', '', repo.name), el('p', '', repo.description));
  const tags = el('div', 'tags'); repo.tags.forEach(tag => tags.append(el('span', '', tag))); card.append(tags);
  const access = link(repo.url, 'Acessar no GitHub', 'repo-link', 'github'); if (access) card.append(access); card.append(el('span', 'repo-slug', repo.slug)); document.querySelector('#repository-grid').append(card);
}
for (const resource of project.resources) { const entry = link(resource.url, resource.title, 'resource-link'); if (entry) { entry.append(el('span', '', resource.description)); document.querySelector('#resource-list').append(entry); document.querySelector('#resources').hidden = false; } }
for (const photo of project.gallery) {
  if (!photo.src || !photo.alt || !photo.width || !photo.height) continue;
  const figure = el('figure'); const image = el('img'); image.src = photo.src; image.alt = photo.alt; image.width = photo.width; image.height = photo.height; image.loading = 'lazy'; image.decoding = 'async'; figure.append(image); if (photo.caption) figure.append(el('figcaption', '', photo.caption)); document.querySelector('#gallery-grid').append(figure); document.querySelector('#galeria').hidden = false;
}
const contact = document.querySelector('#contact-links');
if (project.email) { const email = link('mailto:' + project.email, project.email, 'text-link', 'mail'); if (email) contact.append(email); }
if (project.institutional) { const institutional = link(project.institutional, 'Página institucional', 'text-link', 'portfolio'); if (institutional) contact.append(institutional); }
for (const member of team) {
  if (!member.email && !member.links?.linkedin) continue;
  const person = el('div', 'person-contact'); person.append(el('h3', '', member.name));
  if (member.links?.linkedin) { const profile = link(member.links.linkedin, 'LinkedIn', 'text-link', 'linkedin'); if (profile) { profile.setAttribute('aria-label', `LinkedIn de ${member.name}`); person.append(profile); } }
  if (member.email) { const email = link('mailto:' + member.email, member.email, 'text-link', 'mail'); if (email) person.append(email); }
  contact.append(person);
}
const toggle = document.querySelector('.menu-toggle'); const nav = document.querySelector('#navigation');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); nav.classList.remove('is-open'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); nav.classList.toggle('is-open', open); });
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.querySelector('.header').addEventListener('focusout', () => { requestAnimationFrame(() => { if (!document.activeElement.closest('.header')) closeMenu(); }); });
matchMedia('(min-width: 960px)').addEventListener('change', closeMenu);
const navLinks = [...nav.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main > section[id]')].filter(section => !section.hidden);
  const active = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }); }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 }); sections.forEach(section => active.observe(section));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(node => { node.classList.add('will-reveal'); reveal.observe(node); }); }
}
