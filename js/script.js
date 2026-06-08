document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Ваш запис успішно створено!");

    this.reset();
});
