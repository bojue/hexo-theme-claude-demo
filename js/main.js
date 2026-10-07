/**
 * Hexo Theme Claude - Main Client Script
 * - Table of Contents ScrollSpy (Right Sticky)
 * - Code block one-click copy
 * - Keyboard shortcut for Search modal (Cmd+K / Ctrl+K / '/')
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Table of Contents ScrollSpy
    // ---------------------------------------------------------
    const tocLinks = document.querySelectorAll('.toc-nav a');
    if (tocLinks.length > 0) {
      const headingElements = Array.from(tocLinks)
        .map(link => {
          const id = decodeURIComponent(link.getAttribute('href').substring(1));
          return document.getElementById(id);
        })
        .filter(Boolean);

      const onScroll = () => {
        const scrollPosition = window.scrollY + 120;
        let activeId = '';

        for (let i = headingElements.length - 1; i >= 0; i--) {
          const heading = headingElements[i];
          if (heading && heading.offsetTop <= scrollPosition) {
            activeId = heading.id;
            break;
          }
        }

        tocLinks.forEach(link => {
          const hrefId = decodeURIComponent(link.getAttribute('href').substring(1));
          if (hrefId === activeId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // ---------------------------------------------------------
    // 2. Code Block Copy Buttons
    // ---------------------------------------------------------
    const i18n = document.body.dataset;
    const LABEL_COPY = i18n.i18nCopy || 'Copy';
    const LABEL_COPIED = i18n.i18nCopied || 'Copied';
    const LABEL_FAILED = i18n.i18nCopyError || 'Failed';

    const createCopyBtn = (getText) => {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.textContent = LABEL_COPY;
      copyBtn.setAttribute('aria-label', LABEL_COPY);

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(getText());
          copyBtn.textContent = LABEL_COPIED;
          copyBtn.style.color = 'var(--brand)';
          setTimeout(() => {
            copyBtn.textContent = LABEL_COPY;
            copyBtn.style.color = '';
          }, 2000);
        } catch (err) {
          copyBtn.textContent = LABEL_FAILED;
          setTimeout(() => {
            copyBtn.textContent = LABEL_COPY;
          }, 2000);
        }
      });

      return copyBtn;
    };

    // Hexo highlighted blocks: figure > table > gutter + code (one button per figure)
    document.querySelectorAll('.prose figure.highlight').forEach(fig => {
      const codeCell = fig.querySelector('td.code');
      fig.appendChild(createCopyBtn(() => (codeCell || fig).innerText));
    });

    // Standalone code blocks not wrapped in a highlight figure
    document.querySelectorAll('.prose pre').forEach(pre => {
      if (pre.closest('figure.highlight')) return;
      pre.appendChild(createCopyBtn(() => {
        const code = pre.querySelector('code');
        return code ? code.innerText : pre.innerText;
      }));
    });

    // ---------------------------------------------------------
    // 3. Search Modal & Keyboard Shortcuts
    // ---------------------------------------------------------
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchTrigger = document.getElementById('search-trigger');

    window.openSearch = () => {
      if (searchModal) {
        searchModal.classList.add('open');
        setTimeout(() => searchInput && searchInput.focus(), 50);
      }
    };

    window.closeSearch = () => {
      if (searchModal) {
        searchModal.classList.remove('open');
      }
    };

    if (searchTrigger) {
      searchTrigger.addEventListener('click', window.openSearch);
    }

    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
          window.closeSearch();
        }
      });
    }

    // Shortcut: Cmd+K / Ctrl+K / '/'
    document.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        window.closeSearch();
        return;
      }
      if (!isInput) {
        if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
          e.preventDefault();
          window.openSearch();
        }
      }
    });
  });
})();
