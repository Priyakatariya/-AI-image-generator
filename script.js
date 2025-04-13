const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const loading = document.getElementById("loading");
const generateBtn = document.getElementById("btn");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");
const darkModeToggle = document.getElementById("darkModeToggle");

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});

// Load Dark Mode Preference
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

// Function to generate an image
async function generateImage() {
    const text = inputText.value.trim();
    if (text === "") {
        alert("Please enter a valid text prompt!");
        return;
    }

    loading.style.display = "block"; // Show loading animation
    image.style.display = "none"; // Hide previous image
    resetBtn.classList.add("hidden");
    downloadBtn.classList.add("hidden");

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/ZB-Tech/Text-to-Image",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                },
                method: "POST",
                body: JSON.stringify({ "inputs": text }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch the image. Try again.");
        }

        const result = await response.blob();
        const objectUrl = URL.createObjectURL(result);
        image.src = objectUrl;
        image.style.display = "block";
        image.classList.add("loaded"); // Add fade-in effect
        resetBtn.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
    } catch (error) {
        alert(error.message);
    } finally {
        loading.style.display = "none"; // Hide loading animation
    }
}

// Event Listeners
generateBtn.addEventListener("click", generateImage);
inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generateImage();
    }
});

resetBtn.addEventListener("click", () => {
    inputText.value = "";
    image.style.display = "none";
    loading.style.display = "none";
    resetBtn.classList.add("hidden");
    downloadBtn.classList.add("hidden");
});

downloadBtn.addEventListener("click", () => {
    if (!image.src || image.style.display === "none") {
        alert("No image to download!");
        return;
    }

    const a = document.createElement("a");
    a.href = image.src;
    a.download = "generated-image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
