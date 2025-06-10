document.addEventListener('DOMContentLoaded', function() {
    // Initialize semester displays
    initializeSemesterDisplays();
    
    // Load saved grades from localStorage
    loadSavedGrades();
    
    // Add event listeners for grade selections
    document.querySelectorAll('.grade-select').forEach(select => {
        select.addEventListener('change', function() {
            // Save the grade to localStorage
            const courseId = this.closest('tr').dataset.course;
            localStorage.setItem(courseId, this.value);
            
            // Update calculations
            updateCalculations();
        });
    });
    
    // Add event listener for reset button
    document.getElementById('resetButton').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all grades? This action cannot be undone.')) {
            resetAllGrades();
        }
    });
    
    // Add event listeners for semester tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const semester = this.dataset.semester;
            showSemester(semester);
        });
    });
});

function loadSavedGrades() {
    document.querySelectorAll('.grade-select').forEach(select => {
        const courseId = select.closest('tr').dataset.course;
        const savedGrade = localStorage.getItem(courseId);
        if (savedGrade) {
            select.value = savedGrade;
        }
    });
    updateCalculations();
}

function resetAllGrades() {
    document.querySelectorAll('.grade-select').forEach(select => {
        select.value = '';
        const courseId = select.closest('tr').dataset.course;
        localStorage.removeItem(courseId);
    });
    updateCalculations();
}

function initializeSemesterDisplays() {
    // Show first semester by default
    showSemester(1);
}

function showSemester(semester) {
    // Hide all rows
    document.querySelectorAll('tr[class^="semester-"]').forEach(row => {
        row.style.display = 'none';
    });
    
    // Show rows for selected semester
    document.querySelectorAll(`.semester-${semester}`).forEach(row => {
        row.style.display = '';
    });
    
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[data-semester="${semester}"]`).classList.add('active');
}

function calculateSGPA(semester) {
    let totalCredits = 0;
    let totalGradePoints = 0;
    
    document.querySelectorAll(`.semester-${semester}`).forEach(row => {
        const credits = parseFloat(row.children[1].textContent);
        const grade = parseFloat(row.querySelector('.grade-select').value) || 0;
        
        if (grade > 0) {
            totalCredits += credits;
            totalGradePoints += credits * grade;
        }
    });
    
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
}

function calculateCGPA() {
    let totalCredits = 0;
    let totalGradePoints = 0;
    
    document.querySelectorAll('tr[class^="semester-"]').forEach(row => {
        const credits = parseFloat(row.children[1].textContent);
        const grade = parseFloat(row.querySelector('.grade-select').value) || 0;
        
        if (grade > 0) {
            totalCredits += credits;
            totalGradePoints += credits * grade;
        }
    });
    
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
}

function updateCalculations() {
    // Update CGPA
    const cgpa = calculateCGPA();
    document.getElementById('floating-cgpa').textContent = cgpa;
    
    // Update percentage
    const percentage = (parseFloat(cgpa) * 10).toFixed(2);
    document.getElementById('floating-percentage').textContent = percentage + '%';
    
    // Update semester GPAs
    for (let i = 1; i <= 8; i++) {
        const sgpa = calculateSGPA(i);
        document.querySelector(`.semester-gpa-item[data-semester="${i}"] .semester-sgpa`).textContent = sgpa;
    }
} 