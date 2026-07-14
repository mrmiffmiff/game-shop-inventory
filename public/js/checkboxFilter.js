document.querySelectorAll('[data-checkbox-filter]').forEach(input => {
    const container = document.querySelector(input.dataset.checkboxFilter);
    const labels = [...container.querySelectorAll('label')];
    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        labels.forEach(label => {
            label.style.display = label.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    });
});
