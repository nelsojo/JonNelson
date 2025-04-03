document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            service_id: "service_u7odmdj",
            template_id: "template_9aqycff",
            user_id: "M_mzehx6Heh73C-aF",
            template_params: {
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message")
            }
        })
    }).then(response => {
        if (response.ok) {
            document.getElementById("form-status").textContent = "Message sent successfully!";
            form.reset();
        } else {
            document.getElementById("form-status").textContent = "Error sending message.";
        }
    }).catch(error => {
        console.error("Error:", error);
        document.getElementById("form-status").textContent = "Error sending message.";
    });
});
