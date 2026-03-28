/* ==========================================================================
   TỆP SCRIPT CHÍNH (Xử lý tương tác cho toàn bộ website)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // 1. XỬ LÝ MODAL TUYỂN DỤNG & PORTFOLIO 
    // ==========================================================================
    const btnOpenJobs = document.getElementById('btnOpenJobs');
    const jobsModal = document.getElementById('jobsModal');
    const applyModal = document.getElementById('applyModal');
    
    const recruitmentForm = document.getElementById('recruitmentForm');
    const applySuccessModal = document.getElementById('applySuccessModal');
    const closeApplySuccessBtn = document.getElementById('closeApplySuccessBtn');
    
    if (jobsModal && applyModal) {
        const closeJobsBtn = document.getElementById('closeJobsBtn');
        const closeApplyBtn = document.getElementById('closeApplyBtn');
        const backToJobsBtn = document.getElementById('backToJobsBtn');
        const applyButtons = document.querySelectorAll('.btn-open-apply');

        if (btnOpenJobs) {
            btnOpenJobs.addEventListener('click', function(e) {
                e.preventDefault();
                jobsModal.classList.add('active');
            });
        }

        applyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                jobsModal.classList.remove('active');
                applyModal.classList.add('active');
            });
        });

        if (backToJobsBtn) {
            backToJobsBtn.addEventListener('click', function() {
                applyModal.classList.remove('active');
                jobsModal.classList.add('active');
            });
        }

        if (recruitmentForm) {
            recruitmentForm.addEventListener('submit', function(e) {
                e.preventDefault(); 
                applyModal.classList.remove('active');
                if (applySuccessModal) applySuccessModal.classList.add('active');
                recruitmentForm.reset();
                const uploadText = document.querySelector('.upload-box p');
                if(uploadText) {
                    uploadText.textContent = 'NHẤP ĐỂ TẢI LÊN CV (PDF/DOCX)';
                    uploadText.style.color = '#4b5563';
                }
            });
        }

        if (closeApplySuccessBtn) {
            closeApplySuccessBtn.addEventListener('click', () => {
                if (applySuccessModal) applySuccessModal.classList.remove('active');
            });
        }

        if (closeJobsBtn) closeJobsBtn.addEventListener('click', () => jobsModal.classList.remove('active'));
        if (closeApplyBtn) closeApplyBtn.addEventListener('click', () => applyModal.classList.remove('active'));

        const uploadBox = document.querySelector('.upload-box');
        const cvUpload = document.getElementById('cvUpload');
        if(uploadBox && cvUpload) {
            uploadBox.addEventListener('click', () => cvUpload.click());
            cvUpload.addEventListener('change', function() {
                if(this.files && this.files.length > 0) {
                    uploadBox.querySelector('p').textContent = `ĐÃ CHỌN: ${this.files[0].name}`;
                    uploadBox.querySelector('p').style.color = '#10b981'; 
                }
            });
        }
    }

    // ==========================================================================
    // 2. XỬ LÝ FORM LIÊN HỆ (CONTACT FORM VALIDATION)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const fullName = document.getElementById('fullName');
        const emailAddress = document.getElementById('emailAddress');
        const message = document.getElementById('message');
        
        const successModal = document.getElementById('successModal');
        const closeModalBtn = document.getElementById('closeModalBtn');

        const showError = (input, message) => {
            const formGroup = input.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            input.style.border = '2px solid #ef4444'; 
            errorElement.textContent = message;
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '5px';
            errorElement.style.display = 'block';
            return false;
        };

        const showSuccess = (input) => {
            const formGroup = input.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            input.style.border = '2px solid #10b981'; 
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            return true;
        };

        const checkEmail = (input) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(input.value.trim())) {
                return showSuccess(input);
            } else {
                return showError(input, 'Email không hợp lệ. Vui lòng kiểm tra lại (vd: ten@gmail.com).');
            }
        };

        const checkRequired = (input, fieldName) => {
            if (input.value.trim() === '') {
                return showError(input, `${fieldName} không được để trống.`);
            } else {
                return showSuccess(input);
            }
        };

        if(fullName) fullName.addEventListener('input', () => checkRequired(fullName, 'Họ và tên'));
        if(emailAddress) emailAddress.addEventListener('input', () => {
            if (emailAddress.value.trim() !== '') checkEmail(emailAddress);
            else checkRequired(emailAddress, 'Email');
        });
        if(message) message.addEventListener('input', () => checkRequired(message, 'Nội dung'));

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            let isNameValid = checkRequired(fullName, 'Họ và tên');
            let isEmailValid = emailAddress.value.trim() !== '' ? checkEmail(emailAddress) : checkRequired(emailAddress, 'Email');
            let isMessageValid = checkRequired(message, 'Nội dung');

            if (isNameValid && isEmailValid && isMessageValid) {
                const contactData = {
                    name: fullName.value.trim(),
                    email: emailAddress.value.trim(),
                    subject: document.getElementById('subject').value,
                    message: message.value.trim(),
                    date: new Date().toLocaleString()
                };
                
                let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push(contactData);
                localStorage.setItem('contactMessages', JSON.stringify(messages));

                if (successModal) successModal.classList.add('active');

                contactForm.reset();
                fullName.style.border = '1px solid #d1d5db';
                emailAddress.style.border = '1px solid #d1d5db';