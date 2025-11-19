class HobbyShop {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollToTop();
        this.generateProductGrid(8);
        this.setupSmoothScrolling();
        this.setupFormBingHandler();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = Array.from(document.querySelectorAll('main section'));
        const setActiveLink = () => {
            const fromTop = window.scrollY + 120;
            let currentSection = '#home';
            sections.forEach(section => {
                if (section.offsetTop <= fromTop) currentSection = `#${section.id}`;
            });
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === currentSection));
        };
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(link.getAttribute('href'));
            });
        });
        window.addEventListener('scroll', this.throttle(setActiveLink, 100));
        window.addEventListener('load', setActiveLink);
    }

    setupSmoothScrolling() {
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            e.preventDefault();
            this.scrollToSection(link.getAttribute('href'));
        });
    }

    scrollToSection(sectionId) {
        const target = document.querySelector(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    setupScrollToTop() {
        const toTopBtn = document.getElementById('toTop');
        const toggleToTopButton = () => {
            toTopBtn.style.display = window.scrollY > 400 ? 'inline-block' : 'none';
        };
        toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', this.throttle(toggleToTopButton, 100));
        window.addEventListener('load', toggleToTopButton);
    }

    generateProductGrid(count = 8) {
        const grid = document.getElementById('itemsGrid');
        const products = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            title: `Набор для творчества №${i + 1}`,
            description: 'Идеальный набор для начинающих и опытных мастеров. Включает все необходимые материалы и инструкцию.',
            price: 499 + i * 50,
            alt: `Набор для творчества ${i + 1}`
        }));
        grid.innerHTML = products.map(product => `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <article class="card product-card h-100">
                    <img src="images/creative${product.id}.jpg" class="card-img-top product-image" alt="${product.alt}" loading="lazy">
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title product-title">${product.title}</h3>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="mt-auto">
                            <p class="product-price">${product.price} руб.</p>
                            <a href="#contact" class="btn btn-primary stretched-link">Заказать</a>
                        </div>
                    </div>
                </article>
            </div>
        `).join('');
    }

    setupFormBingHandler() {
        const form = document.getElementById('orderForm');
        const hiddenQuery = document.getElementById('bingQuery');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const requiredFields = [form.customerName, form.productSelect, form.quantity, form.customerMessage];
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) return;
            hiddenQuery.value = `Тип: ${form.request_type.value}; Товар: ${form.productSelect.value}; Количество: ${form.quantity.value}; Имя: ${form.customerName.value.trim()}; Email: ${form.customerEmail.value.trim()}; Сообщение: ${form.customerMessage.value.trim()}`;

            form.submit();
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => new HobbyShop());
