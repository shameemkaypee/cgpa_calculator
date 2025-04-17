document.addEventListener('DOMContentLoaded', () => {
    const sgpaDisplay = document.getElementById('sgpa');
    const percentageDisplay = document.getElementById('percentage');
    const gradeSelects = document.querySelectorAll('.grade-select');

    // Function to calculate SGPA
    function calculateSGPA() {
        let totalGradePoints = 0;
        let totalCredits = 0;

        gradeSelects.forEach(select => {
            const grade = parseInt(select.value);
            if (!isNaN(grade)) {
                const row = select.closest('tr');
                const credits = parseFloat(row.querySelector('td:nth-child(2)').textContent);
                totalGradePoints += grade * credits;
                totalCredits += credits;
            }
        });

        return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    }

    // Function to calculate percentage from CGPA
    function calculatePercentage(cgpa) {
        cgpa = parseFloat(cgpa);
        if (cgpa >= 7.5) {
            return (72 + 9.0 * (cgpa - 7.5)).toFixed(2);
        } else if (cgpa >= 4.5) {
            return (55 + 5.66 * (cgpa - 4.5)).toFixed(2);
        } else if (cgpa >= 1.5) {
            return (20 + 11.66 * (cgpa - 1.5)).toFixed(2);
        } else {
            return "0.00";
        }
    }

    // Function to update results
    function updateResults() {
        const sgpa = calculateSGPA();
        const percentage = calculatePercentage(sgpa);
        
        sgpaDisplay.textContent = sgpa;
        percentageDisplay.textContent = `${percentage}%`;
    }

    // Add event listeners to all grade selects
    gradeSelects.forEach(select => {
        select.addEventListener('change', updateResults);
    });
}); 