const styles = ["office", "party", "vacation"];
const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const loadingText = document.getElementById("loading-text");
const resultSection = document.getElementById("result-section");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const files = Array.from(fileInput.files);
  if (!files.length) return alert("Please select at least one image!");

  loadingText.classList.remove("hidden");
  resultSection.innerHTML = "";

  try {
    const formData = new FormData();
    files.forEach(f => formData.append("images", f));
    const res = await fetch("http://localhost:3000/process", {
      method: "POST",
      body: formData
    });
    const { stylizedSets, error } = await res.json();
    if (error) throw new Error(error);

    const header = document.createElement("div");
    header.className = "grid grid-cols-4 gap-4 text-center font-bold text-gray-700 mb-2";
    ["Original", "Office", "Party", "Vacation"].forEach(txt => {
      const h = document.createElement("div");
      h.textContent = txt;
      header.appendChild(h);
    });
    resultSection.appendChild(header);

    stylizedSets.forEach((set) => {
      const row = document.createElement("div");
      row.className = "grid grid-cols-4 gap-4 mb-8";

      [set.original, set.office, set.party, set.vacation].forEach((url) => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg overflow-hidden shadow";

        const img = document.createElement("img");
        img.src = url;
        img.alt = "stylized outfit";
        img.className = "w-full h-48 object-cover";
        card.appendChild(img);
        row.appendChild(card);
      });
      resultSection.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Oops, something went wrong.");
  } finally {
    loadingText.classList.add("hidden");
  }
});
