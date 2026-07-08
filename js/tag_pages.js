/**
 * Interactive Tagging Page Interactivity
 * Built using Vanilla JS for modern performance and smooth transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tag-search');
  const tagPills = document.querySelectorAll('.tag-cloud .tag-pill');
  const tagSections = document.querySelectorAll('.tag-group-section');

  // Filter function for search input (filters tags and post text)
  function filterTags() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Clear active tag selection when typing a query
    if (query !== '') {
      tagPills.forEach(pill => pill.classList.remove('active'));
    }

    // Filter tag sections and individual posts inside them
    tagSections.forEach(section => {
      const sectionTag = section.getAttribute('data-tag');
      const isTagMatch = sectionTag.replace(/-/g, ' ').includes(query) || sectionTag.includes(query);
      
      const postItems = section.querySelectorAll('.tag-post-item');
      let sectionHasVisiblePosts = false;

      postItems.forEach(item => {
        const titleText = item.querySelector('.tag-post-title').textContent.toLowerCase();
        const descElement = item.querySelector('.tag-post-description');
        const descText = descElement ? descElement.textContent.toLowerCase() : '';
        
        const isPostMatch = titleText.includes(query) || descText.includes(query);

        // Show post if the search query matches the post title/description, or if the tag itself matches, or if query is empty
        if (query === '' || isTagMatch || isPostMatch) {
          item.style.display = 'block';
          sectionHasVisiblePosts = true;
        } else {
          item.style.display = 'none';
        }
      });

      // Show/hide section based on whether it contains any matching posts
      if (query === '' || sectionHasVisiblePosts) {
        section.style.display = 'block';
        setTimeout(() => {
          section.classList.remove('hidden');
        }, 10);
      } else {
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    });

    // Filter cloud tag pills based on tag name or whether their sections have matching posts
    tagPills.forEach(pill => {
      const pillTag = pill.getAttribute('data-tag');
      const tagName = pill.querySelector('span').textContent.toLowerCase();
      const isTagMatch = tagName.includes(query);
      
      const matchingSection = Array.from(tagSections).find(sec => sec.getAttribute('data-tag') === pillTag);
      const sectionHasPosts = matchingSection ? Array.from(matchingSection.querySelectorAll('.tag-post-item')).some(item => item.style.display !== 'none') : false;

      if (query === '' || isTagMatch || sectionHasPosts) {
        pill.style.display = 'inline-flex';
      } else {
        pill.style.display = 'none';
      }
    });
  }

  // Active tag filter function
  function selectTag(selectedSlug) {
    // Reset all post items to block since we are not searching
    tagSections.forEach(section => {
      section.querySelectorAll('.tag-post-item').forEach(item => {
        item.style.display = 'block';
      });
    });

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
