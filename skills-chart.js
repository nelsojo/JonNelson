document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('skillsChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Python', 'C/C++', 'JavaScript', 'HTML', 'CSS',
                'Dart', 'Kotlin', 'SQL',
                'R', 'C#', 'Rust', 'Haskell'
            ],
            datasets: [{
                label: 'Proficiency',
                data: [
                    95, // Python
                    90, // C/C++
                    88, // JavaScript
                    85, // HTML
                    85, // CSS
                    70, // Dart
                    68, // Kotlin
                    70, // SQL
                    50, // R
                    50, // C#
                    45, // Rust
                    40  // Haskell
                ],
                backgroundColor: [
                    '#4CAF50', '#4CAF50', '#4CAF50', '#4CAF50', '#4CAF50', // Very Proficient
                    '#2196F3', '#2196F3', '#2196F3',                        // Knowledgeable
                    '#9C27B0', '#9C27B0', '#9C27B0', '#9C27B0'               // Familiar
                ]
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.parsed.x + '%'
                    }
                }
            }
        }
    });
});
