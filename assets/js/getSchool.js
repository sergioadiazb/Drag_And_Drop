document.addEventListener('DOMContentLoaded', function() {
  axios.get('https://backendmemorygame-production.up.railway.app/api/school/getAllSchools')
    .then(response => {
      const schools = response.data.schools;

      const selectElement = document.getElementById('schools');

      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        selectElement.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al obtener las escuelas:', error);
    });
});
