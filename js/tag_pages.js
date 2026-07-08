/**
 * Interactive Tagging Page Interactivity
 * Built using Vanilla JS for modern performance and smooth transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tag-search');
  const tagPills = document.querySelectorAll('.tag-cloud .tag-pill');
  const tagSections = document.querySelectorAll('.tag-group-section');

  // Filter function for search input
  function filterTags() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Clear active tag selection when typing a query
    if (query !== '') {
      tagPills.forEach(pill => pill.classList.remove('active'));
    }

    // Filter cloud tag pills
    tagPills.forEach(pill => {
      const tagName = pill.querySelector('span').textContent.toLowerCase();
      if (tagName.includes(query)) {
        pill.style.display = 'inline-flex';
      } else {
        pill.style.display = 'none';
      }
    });

    // Filter tag sections below
    tagSections.forEach(section => {
      const sectionTag = section.getAttribute('data-tag');
      const isTagMatch = sectionTag.replace(/-/g, ' ').includes(query) || sectionTag.includes(query);

      if (query === '' || isTagMatch) {
        section.style.display = 'block';
        setTimeout(() => {
          section.classList.remove('hidden');
        }, 10);
      } else {
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    });
  }

  // Active tag filter function
  function selectTag(selectedSlug) {
    // If no tag selected, show all sections
    if (!selectedSlug) {
      tagPills.forEach(pill => pill.classList.remove('active'));
      tagSections.forEach(section => {
        section.style.display = 'block';
        setTimeout(() => {
          section.classList.remove('hidden');
        }, 10);
      });
      return;
    }

    let foundActive = false;
    tagPills.forEach(pill => {
      if (pill.getAttribute('data-tag') === selectedSlug) {
        pill.classList.add('active');
        pill.style.display = 'inline-flex';
        foundActive = true;
      } else {
        pill.classList.remove('active');
      }
    });

    tagSections.forEach(section => {
      if (section.getAttribute('data-tag') === selectedSlug) {
        section.style.display = 'block';
        setTimeout(() => {
          section.classList.remove('hidden');
        }, 10);
      } else {
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    });

    // If invalid tag, reset to show all
    if (!foundActive) {
      selectTag(null);
    }
  }

  // Handle URL hash changes
  function handleHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      searchInput.value = ''; // clear search when navigating via tag click/hash link
      selectTag(hash);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        // Slight delay to allow display styles to apply first
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    } else {
      selectTag(null);
    }
  }

  // Set up search event listener
  if (searchInput) {
    searchInput.addEventListener('input', filterTags);
  }

  // Set up tag pills click handler
  tagPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const tagSlug = pill.getAttribute('data-tag');
      
      // If clicking already active tag, reset hash to show all
      if (pill.classList.contains('active')) {
        e.preventDefault();
        window.location.hash = '';
      }
    });
  });

  // Listen for hash changes (navigating forward/backward or clicking tags)
  window.addEventListener('hashchange', handleHash);

  // Initialize page state
  handleHash();
});
