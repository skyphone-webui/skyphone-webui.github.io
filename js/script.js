// ข้อมูลสินค้า
const products = [
    {
        id: 1,
        name: "iPhone 14 Pro Max",
        price: 12000,
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

// คำนวณผ่อนชำระ
function calculateInstallment() {
    const productPrice = parseInt(document.getElementById('productSelect').value);
    const percentage = parseInt(document.getElementById('installment').value);
    const period = parseInt(document.getElementById('installmentPeriod').value);
    
    // คำนวณยอดผ่อนชำระ
    const downPayment = (productPrice * percentage) / 100;
    const remainingAmount = productPrice - downPayment;
    
    // คำนวณดอกเบี้ย (ตัวอย่าง: 1% ต่อเดือน สำหรับเงินต้นคงเหลือ)
    const interestRate = 0.01;
    let totalPayment = 0;
    let totalInterest = 0;
    
    // คำนวณแบบลดต้นลดดอก
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
    
    // แสดงผลลัพธ์
    const resultDiv = document.getElementById('installmentResult');
    const breakdownDiv = document.querySelector('.installment-breakdown');
    
    resultDiv.innerHTML = `
        <h3>สรุปการผ่อนชำระ</h3>
        <p><strong>เงินดาวน์:</strong> <span>฿${formatNumber(downPayment)}</span></p>
        <p><strong>ยอดคงเหลือ:</strong> <span>฿${formatNumber(remainingAmount)}</span></p>
        <p><strong>ดอกเบี้ยรวม:</strong> <span>฿${formatNumber(totalInterest)}</span></p>
        <p><strong>ผ่อนชำระเดือนละ:</strong> <span class="highlight">฿${formatNumber(monthlyPayment)}</span></p>
    `;
    
    // สร้างตารางแสดงการผ่อนชำระรายเดือน
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
    
    // เพิ่มเอฟเฟกต์การเคลื่อนไหว
    resultDiv.style.animation = 'none';
    breakdownDiv.style.animation = 'none';
    setTimeout(() => {
        resultDiv.style.animation = 'fadeInUp 0.5s ease';
        breakdownDiv.style.animation = 'fadeInUp 0.5s ease 0.1s both';
    }, 10);
}

// ฟังก์ชันจัดรูปแบบตัวเลข
function formatNumber(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ค้นหาสินค้า
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
            
            // เน้นคำที่ค้นหาพบ
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

// เน้นคำที่ค้นหาพบ
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

// รีเซ็ตการเน้นคำ
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

// เลือกสินค้า
function selectProduct(event) {
    const productId = event.target.dataset.id;
    const productPrice = event.target.dataset.price;
    const productSelect = document.getElementById('productSelect');
    
    // เลือกสินค้าในดรอปดาวน์
    for (let i = 0; i < productSelect.options.length; i++) {
        if (productSelect.options[i].value === productPrice) {
            productSelect.selectedIndex = i;
            break;
        }
    }
    
    // เลื่อนไปที่เครื่องคำนวณ
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    
    // คำนวณใหม่
    calculateInstallment();
    
    // เอฟเฟกต์การเลือกปุ่ม
    const buttons = document.querySelectorAll('.select-product');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}

// เพิ่ม Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners สำหรับเครื่องคำนวณ
    document.getElementById('productSelect').addEventListener('change', calculateInstallment);
    document.getElementById('installment').addEventListener('change', calculateInstallment);
    document.getElementById('installmentPeriod').addEventListener('change', calculateInstallment);
    
    // Event listener สำหรับการค้นหา
    document.getElementById('search').addEventListener('input', searchProducts);
    
    // Event listeners สำหรับปุ่มเลือกสินค้า
    document.querySelectorAll('.select-product').forEach(button => {
        button.addEventListener('click', selectProduct);
    });
    
    // คำนวณครั้งแรกเมื่อโหลดหน้า
    calculateInstallment();
});
