const products = [
    {
        id: 1,
        name: "iPhone 14 Pro Max",
        price: 44900,
        image: "phone-image.jpg"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        price: 15000,
        image: "phone-image2.jpg"
    },
    {
        id: 3,
        name: "Google Pixel 7 Pro",
        price: 18000,
        image: "phone-image3.jpg"
    }
];


function calculateInstallment() {
    const productPrice = parseInt(document.getElementById('productSelect').value);
    const percentage = parseInt(document.getElementById('installment').value);
    const period = parseInt(document.getElementById('installmentPeriod').value);
    
    
    const downPayment = (productPrice * percentage) / 100;
    const remainingAmount = productPrice - downPayment;
    
    
    const interestRate = 0.01;
    let totalPayment = 0;
    let totalInterest = 0;
 
    if (percentage < 100) {
        const monthlyPrincipal = remainingAmount / period;
        let remainingPrincipal = remainingAmount;
        totalPayment = 0;
        
        for (let i = 0; i < period; i++) {
            const monthlyInterest = remainingPrincipal * interestRate;
            totalInterest += monthlyInterest;
            remainingPrincipal -= monthlyPrincipal;
            totalPayment += monthlyPrincipal + monthlyInterest;
        }
    }
    
    const monthlyPayment = period > 0 ? totalPayment / period : 0;
    
 
    const resultDiv = document.getElementById('installmentResult');
    const breakdownDiv = document.querySelector('.installment-breakdown');
    
    resultDiv.innerHTML = `
        <h3>สรุปการผ่อนชำระ</h3>
        <p><strong>เงินดาวน์:</strong> <span>฿${formatNumber(downPayment)}</span></p>
        <p><strong>ยอดคงเหลือ:</strong> <span>฿${formatNumber(remainingAmount)}</span></p>
        <p><strong>ดอกเบี้ยรวม:</strong> <span>฿${formatNumber(totalInterest)}</span></p>
        <p><strong>ผ่อนชำระเดือนละ:</strong> <span class="highlight">฿${formatNumber(monthlyPayment)}</span></p>
    `;
    
    
    if (percentage < 100 && period > 0) {
        let tableHTML = `
            <h4>ตารางการผ่อนชำระ</h4>
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>งวดที่</th>
                        <th>เงินต้น</th>
                        <th>ดอกเบี้ย</th>
                        <th>ยอดชำระ</th>
                        <th>เงินต้นคงเหลือ</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let remainingPrincipal = remainingAmount;
        const monthlyPrincipal = remainingAmount / period;
        
        for (let i = 1; i <= period; i++) {
            const monthlyInterest = remainingPrincipal * interestRate;
            const monthlyTotal = monthlyPrincipal + monthlyInterest;
            remainingPrincipal -= monthlyPrincipal;
            
            tableHTML += `
                <tr>
                    <td>${i}</td>
                    <td>฿${formatNumber(monthlyPrincipal)}</td>
                    <td>฿${formatNumber(monthlyInterest)}</td>
                    <td>฿${formatNumber(monthlyTotal)}</td>
                    <td>฿${formatNumber(remainingPrincipal < 0 ? 0 : remainingPrincipal)}</td>
                </tr>
            `;
        }
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        breakdownDiv.innerHTML = tableHTML;
    } else if (percentage === 100) {
        breakdownDiv.innerHTML = `
            <h4>การชำระเงิน</h4>
            <p>คุณเลือกชำระเต็มจำนวน ฿${formatNumber(productPrice)}</p>
            <p>ไม่มีค่าใช้จ่ายในการผ่อนชำระและดอกเบี้ย</p>
        `;
    }
    

    resultDiv.style.animation = 'none';
    breakdownDiv.style.animation = 'none';
    setTimeout(() => {
        resultDiv.style.animation = 'fadeInUp 0.5s ease';
        breakdownDiv.style.animation = 'fadeInUp 0.5s ease 0.1s both';
    }, 10);
}


function formatNumber(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function searchProducts() {
    const searchInput = document.getElementById('search');
    const products = document.querySelectorAll('.product');
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false;
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDetails = product.querySelector('.details').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDetails.includes(searchTerm)) {
            product.style.display = 'block';
            hasResults = true;
            
           
            if (searchTerm.trim() !== '') {
                highlightSearchTerm(product, searchTerm);
            } else {
                resetHighlight(product);
            }
        } else {
            product.style.display = 'none';
        }
    });
    
    const productsSection = document.getElementById('products');
    if (!hasResults && searchTerm.trim() !== '') {
        if (!document.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `<p>ไม่พบสินค้าที่ค้นหา "${searchTerm}"</p>`;
            productsSection.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
}


function highlightSearchTerm(product, term) {
    resetHighlight(product);
    
    const regex = new RegExp(`(${term})`, 'gi');
    const textElements = product.querySelectorAll('h3, p:not(.price)');
    
    textElements.forEach(el => {
        const originalText = el.textContent;
        if (originalText.toLowerCase().includes(term)) {
            el.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
        }
    });
}


function resetHighlight(product) {
    const textElements = product.querySelectorAll('h3, p');
    textElements.forEach(el => {
        const originalHTML = el.innerHTML;
        if (originalHTML.includes('<span class="highlight">')) {
            const text = el.textContent;
            if (el.classList.contains('price')) {
                el.innerHTML = text;
            } else if (el.tagName === 'P') {
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = `<i class="${icon.className}"></i> ${text.replace(icon.textContent, '')}`;
                } else {
                    el.textContent = text;
                }
            } else {
                el.textContent = text;
            }
        }
    });
}


function selectProduct(event) {
    const productId = event.target.dataset.id;
    const productPrice = event.target.dataset.price;
    const productSelect = document.getElementById('productSelect');
    
    
    for (let i = 0; i < productSelect.options.length; i++) {
        if (productSelect.options[i].value === productPrice) {
            productSelect.selectedIndex = i;
            break;
        }
    }
    
    
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    
   
    calculateInstallment();
    
    
    const buttons = document.querySelectorAll('.select-product');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}


document.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('productSelect').addEventListener('change', calculateInstallment);
    document.getElementById('installment').addEventListener('change', calculateInstallment);
    document.getElementById('installmentPeriod').addEventListener('change', calculateInstallment);
    
    
    document.getElementById('search').addEventListener('input', searchProducts);
    
    
    document.querySelectorAll('.select-product').forEach(button => {
        button.addEventListener('click', selectProduct);
    });
    
    
    calculateInstallment();
});


let cart = [];


document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        const productName = e.target.dataset.name;
        const productPrice = parseFloat(e.target.dataset.price);

      
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        
        showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
    });
});


function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Search functionality
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
});

// Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items on calculator page
    if (window.location.pathname.includes('calculator.html')) {
        displayCartItems();
        setupInstallmentCalculator();
    }
});

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    let totalAmount = 0;

    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>ไม่มีสินค้าในตะกร้า</p>';
        totalAmountElement.textContent = '0 บาท';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price.toLocaleString()} บาท</span>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalAmount += item.price;
    });

    totalAmountElement.textContent = `${totalAmount.toLocaleString()} บาท`;
    document.getElementById('productTotal').textContent = `${totalAmount.toLocaleString()} บาท`;
}

function setupInstallmentCalculator() {
    const installmentOptions = document.querySelectorAll('.installment-option');
    const interestRates = {
        6: 0.05,   // 5% for 6 months
        10: 0.08,  // 8% for 10 months
        12: 0.10,  // 10% for 12 months
        24: 0.15   // 15% for 24 months
    };

    installmentOptions.forEach(option => {
        option.addEventListener('click', function() {
           
            installmentOptions.forEach(opt => opt.classList.remove('active'));
           
            this.classList.add('active');

            const months = parseInt(this.dataset.months);
            const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
            const interestRate = interestRates[months];
            const interest = totalAmount * interestRate;
            const totalPayment = totalAmount + interest;
            const monthlyPayment = totalPayment / months;

           
            document.getElementById('installmentMonths').textContent = `${months} เดือน`;
            document.getElementById('interest').textContent = `${interest.toLocaleString()} บาท`;
            document.getElementById('monthlyPayment').textContent = `${monthlyPayment.toLocaleString()} บาท`;
            document.getElementById('totalPayment').textContent = `${totalPayment.toLocaleString()} บาท`;
        });
    });
}
