import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site, metaForPath } from '../seo.js';

/* Keeps <head> in sync on client-side navigation. The build-time prerender
   writes the same tags into each route's HTML, so this only has to correct
   them after a route change, not create them from nothing. */
function setTag(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.rel ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    const canonical = site.url + (meta.path === '/' ? '/' : meta.path);

    document.title = meta.title;

    setTag('meta[name="description"]', { name: 'description', content: meta.description });
    setTag('link[rel="canonical"]', { rel: 'canonical', href: canonical });

    setTag('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    setTag('meta[property="og:description"]', { property: 'og:description', content: meta.description });
    setTag('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setTag('meta[property="og:type"]', { property: 'og:type', content: 'website' });

    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    setTag('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });

    // Only the 404 route is withheld from the index.
    const robots = document.head.querySelector('meta[name="robots"]');
    if (meta.noindex) {
      setTag('meta[name="robots"]', { name: 'robots', content: 'noindex, follow' });
    } else if (robots) {
      robots.remove();
    }
  }, [pathname]);

  return null;
}
