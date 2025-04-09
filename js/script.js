function calculateInstallment() {
    const productPrice = parseInt(document.getElementById('productPrice').value) || 0;
    const percentage = parseInt(document.getElementById('installment').value);
    const period = parseInt(document.getElementById('installmentPeriod').value);
    const serviceFee = parseInt(document.getElementById('serviceFee').value) || 0;

    
    const downPayment = (productPrice * percentage) / 100;
    const loanAmount = productPrice - downPayment;

 
    const multipliers = {
        6: 0.3167,
        8: 0.2438,
        10: 0.2050
    };

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalContractAmount = 0;

    if (percentage < 100 && multipliers[period]) {
        monthlyPayment = Math.ceil(loanAmount * multipliers[period]) + serviceFee;
        totalPayment = monthlyPayment * period;
        totalContractAmount = downPayment + totalPayment;
    }

    const resultDiv = document.getElementById('installmentResult');
    resultDiv.innerHTML = `
        <h3>สรุปการผ่อนชำระ</h3>
        <div class="result-grid">
            <div class="result-item">
                <span class="label">ราคาสินค้า:</span>
                <span class="value">฿${formatNumber(productPrice)}</span>
            </div>
            <div class="result-item">
                <span class="label">เงินดาวน์ (${percentage}%):</span>
                <span class="value">฿${formatNumber(downPayment)}</span>
            </div>
            <div class="result-item">
                <span class="label">ยอดสินเชื่อ:</span>
                <span class="value">฿${formatNumber(loanAmount)}</span>
            </div>
            <div class="result-item">
                <span class="label">ค่าบริการต่อเดือน:</span>
                <span class="value">฿${formatNumber(serviceFee)}</span>
            </div>
            <div class="result-item highlight">
                <span class="label">ผ่อนชำระเดือนละ:</span>
                <span class="value">฿${formatNumber(monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span class="label">ยอดผ่อนรวม:</span>
                <span class="value">฿${formatNumber(totalPayment)}</span>
            </div>
            <div class="result-item highlight">
                <span class="label">รวมเงินทำสัญญา:</span>
                <span class="value">฿${formatNumber(totalContractAmount)}</span>
            </div>
        </div>
    `;

 
    if (percentage < 100 && multipliers[period]) {
        let tableHTML = `
            <h4>ตารางการผ่อนชำระ</h4>
            <div class="table-container">
                <div class="table-scroll">
                    <table class="payment-table">
                        <thead>
                            <tr>
                                <th>งวดที่</th>
                                <th>เงินต้น</th>
                                <th>ดอกเบี้ย</th>
                                <th>ค่าบริการ</th>
                                <th>ยอดชำระ</th>
                                <th>เงินต้นคงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        let remainingPrincipal = loanAmount;
        const monthlyPrincipal = Math.ceil(loanAmount / period);
        const monthlyInterest = Math.ceil(loanAmount * multipliers[period]) - monthlyPrincipal;

        for (let i = 1; i <= period; i++) {
            const currentPrincipal = i === period ? remainingPrincipal : monthlyPrincipal;
            const currentInterest = monthlyInterest;
            const currentServiceFee = serviceFee;
            const currentPayment = currentPrincipal + currentInterest + currentServiceFee;
            
            remainingPrincipal -= currentPrincipal;

            tableHTML += `
                <tr>
                    <td>${i}</td>
                    <td>฿${formatNumber(currentPrincipal)}</td>
                    <td>฿${formatNumber(currentInterest)}</td>
                    <td>฿${formatNumber(currentServiceFee)}</td>
                    <td>฿${formatNumber(currentPayment)}</td>
                    <td>฿${formatNumber(remainingPrincipal)}</td>
                </tr>
            `;
        }

        tableHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.querySelector('.installment-breakdown').innerHTML = tableHTML;
    } else if (percentage === 100) {
        document.querySelector('.installment-breakdown').innerHTML = `
            <h4>การชำระเงิน</h4>
            <p>คุณเลือกชำระเต็มจำนวน ฿${formatNumber(productPrice)}</p>
            <p>ไม่มีค่าใช้จ่ายในการผ่อนชำระและดอกเบี้ย</p>
        `;
    }

   
    resultDiv.style.animation = 'none';
    document.querySelector('.installment-breakdown').style.animation = 'none';
    setTimeout(() => {
        resultDiv.style.animation = 'fadeInUp 0.5s ease';
        document.querySelector('.installment-breakdown').style.animation = 'fadeInUp 0.5s ease 0.1s both';
    }, 10);
}

function formatNumber(number) {
    if (isNaN(number) || number === null || number === undefined || number === '') {
        return '-';
    }
    return number.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function searchProducts() {
    const searchInput = document.getElementById('search');
    const products = document.querySelectorAll('.product');
    const searchTerm = searchInput.value.toLowerCase().trim();
    let hasResults = false;
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDetails = product.querySelector('.details').textContent.toLowerCase();
        const productPrice = product.querySelector('.price').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || 
            productDetails.includes(searchTerm) || 
            productPrice.includes(searchTerm)) {
            product.style.display = 'block';
            hasResults = true;
            
            if (searchTerm !== '') {
                highlightSearchTerm(product, searchTerm);
            } else {
                resetHighlight(product);
            }
        } else {
            product.style.display = 'none';
        }
    });
    
    const productsSection = document.getElementById('products');
    const noResults = document.querySelector('.no-results');
    
    if (!hasResults && searchTerm !== '') {
        if (!noResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <p>ไม่พบสินค้าที่ค้นหา "${searchTerm}"</p>
                <p class="suggestion">ลองค้นหาด้วยคำอื่นหรือตรวจสอบการสะกดคำ</p>
            `;
            productsSection.appendChild(noResultsDiv);
        }
    } else if (noResults) {
        noResults.remove();
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
    const productPrice = document.getElementById('productPrice');
    
    
    for (let i = 0; i < productPrice.options.length; i++) {
        if (productPrice.options[i].value === productPrice) {
            productPrice.selectedIndex = i;
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
    
    document.getElementById('productPrice').addEventListener('change', calculateInstallment);
    document.getElementById('installment').addEventListener('change', calculateInstallment);
    document.getElementById('installmentPeriod').addEventListener('change', calculateInstallment);
    document.getElementById('serviceFee').addEventListener('change', calculateInstallment);
    
    
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', () => {
        searchProducts();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', () => {
        searchProducts();
    });
    
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

document.addEventListener('DOMContentLoaded', function() {

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
        6: 0.05,   
        10: 0.08,  
        12: 0.10,  
        24: 0.15   
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